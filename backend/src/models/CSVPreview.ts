import { NormalizedCSVRecord } from "./NormalizedCSVRecord";

/**
 * Represents the finalized preview response after CSV parsing,
 * validation, and normalization.
 */
export interface CSVPreview {
  /**
   * The list of trimmed, non-empty active CSV headers.
   */
  headers: string[];

  /**
   * Sub-selection containing the first 10 normalized rows.
   */
  previewRows: NormalizedCSVRecord[];

  /**
   * The total quantity of non-empty records processed.
   */
  totalRows: number;
}
