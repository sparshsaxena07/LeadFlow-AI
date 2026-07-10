/**
 * Represents a parsed row after normalization operations have run.
 * Contains trimmed header names mapped to normalized, clean string values.
 */
export interface NormalizedCSVRecord {
  /**
   * The 1-based index representing the line number of this record.
   */
  rowNumber: number;

  /**
   * Normalized header-to-value key-value map.
   */
  normalized: Record<string, string | null>;
}
