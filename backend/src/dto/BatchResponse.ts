/**
 * Future Responsibility:
 * Data Transfer Object representing execution summaries for individual
 * micro-batches processed during extraction or validation.
 */

export interface BatchResponseDto {
  batchIndex: number;
  processedCount: number;
  successCount: number;
  failureCount: number;
}
