import { RawCSVRecord } from "@/models/RawCSVRecord";
import { NormalizedCSVRecord } from "@/models/NormalizedCSVRecord";

export class CSVNormalizer {
  /**
   * Normalizes raw records and drops trailing columns where headers are empty.
   * Performs cell trimming, whitespace collapsing, and null conversion.
   */
  normalize(
    rawRecords: RawCSVRecord[],
    originalHeaders: string[],
  ): { headers: string[]; records: NormalizedCSVRecord[] } {
    // 1. Find the last non-empty header index to drop empty trailing columns
    const trimmedHeaders = originalHeaders.map((h) => h.trim());
    let lastNonEmptyIndex = trimmedHeaders.length - 1;

    while (lastNonEmptyIndex >= 0 && !trimmedHeaders[lastNonEmptyIndex]) {
      lastNonEmptyIndex--;
    }

    // Keep active headers up to lastNonEmptyIndex
    const activeHeaders = trimmedHeaders.slice(0, lastNonEmptyIndex + 1);

    // 2. Normalize rows mapping to active headers
    const records: NormalizedCSVRecord[] = rawRecords.map((record) => {
      const normalized: Record<string, string | null> = {};

      activeHeaders.forEach((header, index) => {
        const originalHeaderName = originalHeaders[index];
        const rawValue = record.raw[originalHeaderName];

        if (rawValue === null || rawValue === undefined) {
          normalized[header] = null;
        } else {
          // Trim whitespace
          let cleanVal = rawValue.trim();

          // Normalize repeated space characters to a single space
          cleanVal = cleanVal.replace(/\s+/g, " ");

          // Convert empty strings to null
          normalized[header] = cleanVal === "" ? null : cleanVal;
        }
      });

      return {
        rowNumber: record.rowNumber,
        normalized,
      };
    });

    return {
      headers: activeHeaders,
      records,
    };
  }
}
