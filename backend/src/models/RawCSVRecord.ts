/**
 * Represents a raw parsed row from a CSV document.
 * Contains original headers mapped exactly to cell strings.
 */
export interface RawCSVRecord {
  /**
   * The 1-based index representing the line number of this record.
   */
  rowNumber: number;

  /**
   * Raw header-to-value key-value map.
   */
  raw: Record<string, string | null>;
}
