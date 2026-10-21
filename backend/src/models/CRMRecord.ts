import { CRMStatus } from "../shared/enums/CRMStatus";
import { DataSource } from "../shared/enums/DataSource";

/**
 * Domain model representing a single lead record within the LeadFlow CRM schema.
 * All fields are optional/nullable in structure, pending dynamic validation rules.
 */
export interface CRMRecord {
  rowNumber?: number | null;
  created_at?: string | null;
  confidence?: number | null;
  name?: string | null;
  email?: string | null;
  country_code?: string | null;
  mobile_without_country_code?: string | null;
  company?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  lead_owner?: string | null;
  crm_status?: CRMStatus | null;
  crm_note?: string | null;
  data_source?: DataSource | null;
  possession_time?: string | null;
  description?: string | null;
}
