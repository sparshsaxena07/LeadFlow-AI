/**
 * Future Responsibility:
 * House global system-wide TS Enums (e.g., job statuses, CSV formats, mapping modes).
 */

export enum ImportJobStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum CRMFieldMappingType {
  EXACT = "EXACT",
  FUZZY = "FUZZY",
  MANUAL = "MANUAL",
}
