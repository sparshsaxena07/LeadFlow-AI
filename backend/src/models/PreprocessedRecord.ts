/**
 * Enriched metadata derived deterministically from column headers and cell values
 * before forwarding data to AI pipelines.
 */
export interface PreprocessedMetadata {
  emails: string[];
  phoneNumbers: string[];
  countryCodes: string[];
  detectedDates: string[];
  possibleNameColumns: string[];
  possibleCompanyColumns: string[];
  possiblePhoneColumns: string[];
  possibleNoteColumns: string[];
  unknownColumns: string[];
}

/**
 * Represents a normalized CSV record enriched with analyzed metadata.
 */
export interface PreprocessedRecord {
  /**
   * The 1-based line number of the record from the CSV file.
   */
  rowNumber: number;

  /**
   * Normalized values map.
   */
  normalized: Record<string, string | null>;

  /**
   * Deterministic metadata analysis.
   */
  metadata: PreprocessedMetadata;
}
