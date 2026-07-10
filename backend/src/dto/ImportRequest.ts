/**
 * Future Responsibility:
 * Data Transfer Object representing the request body schema when submitting
 * a CSV file import or field mappings configuration.
 */

export interface ImportRequestDto {
  fileId?: string;
  mappings?: Record<string, string>;
  options?: {
    skipErrors?: boolean;
    dryRun?: boolean;
  };
}
