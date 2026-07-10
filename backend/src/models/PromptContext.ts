import { DetectedColumns } from "./DetectedColumns";
import { PreprocessedRecord } from "./PreprocessedRecord";

/**
 * Context container used to compile the prompt payload for the LLM.
 */
export interface PromptContext {
  batchNumber: number;
  totalBatches: number;
  totalRows: number;
  originalHeaders: string[];
  detectedColumns: DetectedColumns;
  records: PreprocessedRecord[];
}
