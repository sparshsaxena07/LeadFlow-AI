import { crmRecordSchema, CRMRecordInput } from "@/schemas/crm.schema";
import { env } from "../../../config/env";
import { logger } from "@/utils/logger";

/**
 * Detailed error info for invalid fields.
 */
export interface CRMFieldError {
  path: string;
  message: string;
}

/**
 * Representation of crm record validation output.
 */
export interface CRMValidationResult {
  isValid: boolean;
  record?: CRMRecordInput;
  errors?: CRMFieldError[];
}

/**
 * Normalizes a raw date string/value to ISO 8601 format or returns null.
 * Does not throw.
 */
export function normalizeDate(value: unknown): string | null | undefined {
  if (value === null) {
    return null;
  }
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    if (typeof value === "number") {
      try {
        return new Date(value).toISOString();
      } catch {
        return null;
      }
    }
    return null;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }

  // Explicitly parse DD/MM/YYYY or DD-MM-YYYY to avoid browser/Node localization parse issues
  const dmyRegex = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/;
  const match = trimmed.match(dmyRegex);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);
    try {
      const parsedDate = new Date(Date.UTC(year, month, day));
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    } catch {
      // Fallback
    }
  }

  const timestamp = Date.parse(trimmed);
  if (!isNaN(timestamp)) {
    try {
      return new Date(timestamp).toISOString();
    } catch {
      return null;
    }
  }

  return null;
}

export class CRMValidator {
  /**
   * Validates a single record against the Zod schema.
   * Cleans formatting artifacts (spaces, dashes, parentheses) from mobile entries.
   */
  validate(record: unknown): CRMValidationResult {
    let targetRecord = record;

    if (record && typeof record === "object") {
      const clone = { ...(record as Record<string, unknown>) };
      
      // Clean mobile format marks
      if (typeof clone.mobile_without_country_code === "string") {
        clone.mobile_without_country_code = clone.mobile_without_country_code.replace(/[-\s.()]/g, "");
      }
      
      // Normalize created_at date field
      if ("created_at" in clone) {
        clone.created_at = normalizeDate(clone.created_at);
      }
      
      targetRecord = clone;
    }

    const check = crmRecordSchema.safeParse(targetRecord);

    if (check.success) {
      const data = { ...check.data } as Record<string, unknown>;
      // Sanitize fields against CSV Formula Injections (excluding email and country_code)
      Object.keys(data).forEach((key) => {
        const val = data[key];
        if (typeof val === "string" && key !== "country_code" && key !== "email") {
          const trimmed = val.trim();
          if (
            trimmed.startsWith("=") ||
            trimmed.startsWith("+") ||
            trimmed.startsWith("-") ||
            trimmed.startsWith("@")
          ) {
            data[key] = `'${val}`;
          }
        }
      });

      return {
        isValid: true,
        record: data as CRMRecordInput,
      };
    }

    // Verbose logging in development mode
    if (env.isDev) {
      logger.info(`[Validation Failed Details]
Original Record: ${JSON.stringify(record, null, 2)}
Normalized Record: ${JSON.stringify(targetRecord, null, 2)}
Validation Errors: ${JSON.stringify(check.error.errors, null, 2)}`);
    }

    const errors: CRMFieldError[] = check.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));

    return {
      isValid: false,
      errors,
    };
  }
}
