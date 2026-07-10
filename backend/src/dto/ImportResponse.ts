/**
 * Future Responsibility:
 * Data Transfer Object representing the server's reply after finishing
 * a CSV import run, capturing run summaries and record processing results.
 */

export interface ImportResponseDto {
  success: boolean;
  jobId: string;
  totalRecordsProcessed: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    row: number;
    column?: string;
    message: string;
  }>;
}
