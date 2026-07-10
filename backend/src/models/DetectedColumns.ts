/**
 * Represents columns grouped by their deterministic semantic classification.
 */
export interface DetectedColumns {
  emailColumns: string[];
  phoneColumns: string[];
  nameColumns: string[];
  companyColumns: string[];
  noteColumns: string[];
  dateColumns: string[];
  unknownColumns: string[];
}
