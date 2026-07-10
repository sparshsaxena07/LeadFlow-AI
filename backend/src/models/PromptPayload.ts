import { DetectedColumns } from "./DetectedColumns";
import { PreprocessedRecord } from "./PreprocessedRecord";

/**
 * Metadata layout grouped inside the serialized payload structure.
 */
export interface PromptPayloadMetadata {
  batchNumber: number;
  totalBatches: number;
  totalRows: number;
  originalHeaders: string[];
  detectedColumns: DetectedColumns;
}

/**
 * Payload sent directly inside the LLM prompt.
 * Contains batch and column metadata, alongside raw preprocessed data rows.
 */
export interface PromptPayload {
  metadata: PromptPayloadMetadata;
  records: PreprocessedRecord[];
}
