import { CRMRecordInput } from "@/schemas/crm.schema";

/**
 * Future Responsibility:
 * Inspect mapped records against schema rules, accumulating field-level validation
 * issues (e.g. invalid emails, row number indices, and unmapped fields) to report back.
 */

export class CRMValidator {
  validateRecord(_record: CRMRecordInput, _rowNumber: number): { isValid: boolean; errors: string[] } {
    // Placeholder row-level checks
    return { isValid: true, errors: [] };
  }
}
