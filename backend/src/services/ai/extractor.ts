import { PromptContext } from "@/models/PromptContext";
import { CRMRecord } from "@/models/CRMRecord";
import { buildPrompt } from "@/prompts/builder";
import { AIProvider } from "./providers/AIProvider";
import { AIProviderFactory } from "./providers/AIProviderFactory";
import { ResponseParser } from "./responseParser";
import { CRMValidator } from "../validation/crmValidator";

export interface ExtractorResult {
  records: CRMRecord[];
  skipped: {
    rowNumber: number;
    reason: string;
  }[];
}

export class ExtractorService {
  private aiProvider: AIProvider = AIProviderFactory.create();
  private responseParser = new ResponseParser();
  private crmValidator = new CRMValidator();

  /**
   * Orchestrates the AI processing pipeline:
   * PromptContext -> buildPrompt() -> AIProvider.generate() -> ResponseParser -> CRMValidator
   */
  async extract(context: PromptContext): Promise<ExtractorResult> {
    // 1. Build the prompt from context
    const prompt = buildPrompt(context);

    // 2. Dispatch generate request to the LLM client
    const rawResponse = await this.aiProvider.generate(prompt);

    // 3. Parse JSON format response object
    const parsed = this.responseParser.parse(rawResponse);

    const records: CRMRecord[] = [];
    const skipped: { rowNumber: number; reason: string }[] = [];

    // Collect any records skipped by the AI engine
    if (parsed.skipped && Array.isArray(parsed.skipped)) {
      parsed.skipped.forEach((skipItem: unknown) => {
        const item = skipItem as Record<string, unknown>;
        skipped.push({
          rowNumber: Number(item.rowNumber) || 0,
          reason: String(item.reason || "Skipped by AI mapping engine"),
        });
      });
    }

    // 4. Validate output records using the CRM schema validator
    if (parsed.records && Array.isArray(parsed.records)) {
      parsed.records.forEach((recordItem: unknown, index: number) => {
        const item = recordItem as Record<string, unknown>;
        const returnedRowNumber = Number(item.rowNumber);
        const matchingRecord = !isNaN(returnedRowNumber)
          ? context.records.find((r) => r.rowNumber === returnedRowNumber)
          : context.records[index];

        const rowNumber = matchingRecord ? matchingRecord.rowNumber : (returnedRowNumber || index + 1);

        const validation = this.crmValidator.validate(recordItem);
        if (validation.isValid && validation.record) {
          const validatedRecord = {
            ...validation.record,
            rowNumber,
          } as CRMRecord;
          records.push(validatedRecord);
        } else {
          const validationErrorMsg = validation.errors
            ? validation.errors.map((e) => `${e.path}: ${e.message}`).join(", ")
            : "Zod verification failed";

          skipped.push({
            rowNumber,
            reason: `Validation failed: ${validationErrorMsg}`,
          });
        }
      });
    }

    return {
      records,
      skipped,
    };
  }
}
