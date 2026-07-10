/**
 * Future Responsibility:
 * Data Transfer Object representing normalized and validated records ready
 * to be saved to databases or dispatched directly to target CRM APIs.
 */

export interface CRMRecordDto {
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  companyName?: string;
  jobTitle?: string;
  mappedAt: string;
  rawRecordIndex: number;
}
