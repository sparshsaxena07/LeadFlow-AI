import { CSVValidator } from "@/validators/csv.validator";
import { CSVParser } from "./parser";
import { CSVNormalizer } from "./normalizer";
import { CSVPreview } from "@/models/CSVPreview";
import { NormalizedCSVRecord } from "@/models/NormalizedCSVRecord";
import Papa from "papaparse";

export class CSVService {
  private validator = new CSVValidator();
  private parser = new CSVParser();
  private normalizer = new CSVNormalizer();

  /**
   * Orchestrates validation, parsing, normalization, and DTO output.
   * Throws structured error payloads on validation issues.
   */
  processUpload(file: Express.Multer.File | undefined): CSVPreview {
    const { headers, normalizedRecords } = this.processFull(file);

    // Build and return the preview DTO (first 10 records)
    return {
      headers,
      previewRows: normalizedRecords.slice(0, 10),
      totalRows: normalizedRecords.length,
    };
  }

  /**
   * Runs the full parsing and normalization pipeline, returning all records.
   */
  processFull(file: Express.Multer.File | undefined): {
    headers: string[];
    normalizedRecords: NormalizedCSVRecord[];
  } {
    // 1. Run file metadata validation
    const fileErrors = this.validator.validateFile(file);
    if (fileErrors.length > 0) {
      throw {
        status: 400,
        errors: fileErrors,
      };
    }

    // Since validator verified file exists, it is safe to assert file is defined.
    const csvContent = file!.buffer.toString("utf-8");

    // Extract original headers exactly using Papa Parse (preserving ordering)
    const headerResult = Papa.parse(csvContent, { preview: 1 });
    const originalHeaders: string[] = (headerResult.data[0] as string[]) || [];

    // 2. Parse raw lines to RawCSVRecord objects
    const rawRecords = this.parser.parse(csvContent);

    // 3. Verify that the file has at least one data row
    const recordErrors = this.validator.validateRecordsCount(rawRecords.length);
    if (recordErrors.length > 0) {
      throw {
        status: 400,
        errors: recordErrors,
      };
    }

    // 4. Normalize the data and headers
    const { headers, records: normalizedRecords } = this.normalizer.normalize(
      rawRecords,
      originalHeaders,
    );

    return {
      headers,
      normalizedRecords,
    };
  }
}
