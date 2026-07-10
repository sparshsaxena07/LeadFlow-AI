import { Request, Response, NextFunction } from "express";
import { CSVService } from "@/services/csv/csv.service";
import { Preprocessor } from "@/services/csv/preprocessor";
import { BatchService } from "@/services/ai/batchService";
import { ExtractorService } from "@/services/ai/extractor";
import { HeaderAnalyzer } from "@/services/csv/headerAnalyzer";
import { withRetry } from "@/services/ai/retry";
import { CRMRecord } from "@/models/CRMRecord";
import { PromptContext } from "@/models/PromptContext";
import { HeaderIntelligenceService } from "@/services/header-intelligence/headerIntelligence.service";

export class ImportController {
  private csvService = new CSVService();
  private preprocessor = new Preprocessor();
  private batchService = new BatchService();
  private extractorService = new ExtractorService();
  private headerAnalyzer = new HeaderAnalyzer();
  private headerIntelligenceService = new HeaderIntelligenceService();

  /**
   * Action handler for POST /api/import/upload.
   * Hands off file payloads to the CSV service and returns the processed preview details.
   */
  uploadCSV = (req: Request, res: Response, _next: NextFunction): void => {
    try {
      const result = this.csvService.processUpload(req.file);
      const headerMappings = this.headerIntelligenceService.analyzeHeaders(result.headers);

      res.status(200).json({
        success: true,
        headers: result.headers,
        preview: result.previewRows,
        totalRows: result.totalRows,
        headerMappings,
      });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  /**
   * Action handler for POST /api/import/process.
   * Runs the full ingestion pipeline: Preprocessing -> Batching -> AI Extraction -> Merging results.
   */
  processCSV = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      // 1. Receive uploaded CSV & run full normalization
      const { headers, normalizedRecords } = this.csvService.processFull(req.file);

      // 2. Preprocess records
      const preprocessedRecords = this.preprocessor.preprocess(normalizedRecords);

      // 3. Batch records
      const batches = this.batchService.chunk(normalizedRecords);

      // 4. Detected columns header analysis (run once for the file headers)
      const detectedColumns = this.headerAnalyzer.analyze(headers);

      const totalBatches = batches.length;
      const totalRows = normalizedRecords.length;

      const allRecords: CRMRecord[] = [];
      const allSkipped: Array<{ rowNumber: number; reason: string }> = [];

      // 5. Orchestrate extraction for each batch
      for (let i = 0; i < batches.length; i++) {
        const batchRecords = batches[i];
        const batchRowNumbers = new Set(batchRecords.map((r) => r.rowNumber));

        // Filter the matching PreprocessedRecords for this batch
        const batchPreprocessed = preprocessedRecords.filter((r) =>
          batchRowNumbers.has(r.rowNumber),
        );

        const promptContext: PromptContext = {
          batchNumber: i + 1,
          totalBatches,
          totalRows,
          originalHeaders: headers,
          detectedColumns,
          records: batchPreprocessed,
        };

        // Call the extractor wrapped inside our retry logic (supports retries/backoffs)
        const batchResult = await withRetry(async () => {
          return await this.extractorService.extract(promptContext);
        });

        // 6. Merge batch results
        allRecords.push(...batchResult.records);
        allSkipped.push(...batchResult.skipped);
      }

      // 7. Return summary response
      res.status(200).json({
        success: true,
        imported: allRecords.length,
        skipped: allSkipped,
        records: allRecords,
      });
    } catch (err) {
      this.handleError(err, res);
    }
  };

  private handleError(err: unknown, res: Response): void {
    const errorObj = err as Error & { status?: number; errorDetails?: Array<Record<string, unknown>>; errors?: unknown };
    const isQuotaExceeded =
      errorObj.status === 429 ||
      (errorObj.message && (
        errorObj.message.includes("429") ||
        errorObj.message.includes("Quota exceeded") ||
        errorObj.message.includes("RESOURCE_EXHAUSTED") ||
        errorObj.message.includes("limit:")
      ));

    if (isQuotaExceeded) {
      let retryAfter = 60;
      if (errorObj.errorDetails && Array.isArray(errorObj.errorDetails)) {
        const retryInfo = errorObj.errorDetails.find(
          (d) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
        );
        if (retryInfo && typeof retryInfo.retryDelay === "string") {
          const match = retryInfo.retryDelay.match(/^(\d+)s$/);
          if (match) {
            retryAfter = parseInt(match[1], 10);
          }
        }
      } else if (errorObj.message) {
        const match = errorObj.message.match(/retry after (\d+)s/i) || errorObj.message.match(/(\d+)\s*seconds/i);
        if (match) {
          retryAfter = parseInt(match[1], 10);
        }
      }

      res.status(429).json({
        success: false,
        error: {
          code: "GEMINI_QUOTA_EXCEEDED",
          message: "Gemini API quota exceeded. Please retry later.",
          retryAfter,
        },
      });
      return;
    }

    if (errorObj && typeof errorObj === "object" && "errors" in errorObj) {
      res.status(errorObj.status || 400).json({
        success: false,
        errors: errorObj.errors,
      });
      return;
    }

    res.status(400).json({
      success: false,
      errors: [
        {
          code: "PROCESSING_ERROR",
          message: errorObj.message || "An unexpected error occurred while processing lead records.",
        },
      ],
    });
  }
}
