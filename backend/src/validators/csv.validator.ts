import path from "path";

/**
 * Supported error codes for CSV ingestion validation.
 */
export type CSVValidationErrorCode =
  | "MISSING_FILE"
  | "INVALID_EXTENSION"
  | "INVALID_MIME"
  | "FILE_TOO_LARGE"
  | "EMPTY_CSV";

/**
 * Representation of a structured validation error.
 */
export interface CSVValidationError {
  code: CSVValidationErrorCode;
  message: string;
}

export class CSVValidator {
  /**
   * Validates the uploaded file metadata.
   * Checks existence, file extension, MIME type, size limits, and basic buffer structure.
   */
  validateFile(file: Express.Multer.File | undefined): CSVValidationError[] {
    const errors: CSVValidationError[] = [];

    // 1. File exists
    if (!file) {
      errors.push({
        code: "MISSING_FILE",
        message: "File is required.",
      });
      return errors; // Return early if no file is present
    }

    // 2. CSV extension
    const extension = path.extname(file.originalname).toLowerCase();
    if (extension !== ".csv") {
      errors.push({
        code: "INVALID_EXTENSION",
        message: `Unsupported file extension '${extension}'. File extension must be '.csv'.`,
      });
    }

    // 3. MIME type checking
    const allowedMimes = [
      "text/csv",
      "application/vnd.ms-excel",
      "text/x-csv",
      "application/csv",
      "text/comma-separated-values",
      "text/plain"
    ];
    if (!allowedMimes.includes(file.mimetype.toLowerCase())) {
      errors.push({
        code: "INVALID_MIME",
        message: `Unsupported MIME type '${file.mimetype}'. Only CSV uploads are allowed.`,
      });
    }

    // 4. File Size (Max 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE_BYTES) {
      errors.push({
        code: "FILE_TOO_LARGE",
        message: "File exceeds the maximum size limit of 10MB.",
      });
    }

    // 5. Basic empty buffer validation
    if (!file.buffer || file.buffer.length === 0) {
      errors.push({
        code: "EMPTY_CSV",
        message: "The uploaded CSV file is empty.",
      });
    }

    return errors;
  }

  /**
   * Validates the records length to ensure at least one row exists.
   */
  validateRecordsCount(recordsCount: number): CSVValidationError[] {
    const errors: CSVValidationError[] = [];
    if (recordsCount === 0) {
      errors.push({
        code: "EMPTY_CSV",
        message: "CSV must contain at least one row of data.",
      });
    }
    return errors;
  }
}
