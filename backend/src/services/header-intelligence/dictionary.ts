/**
 * Synonym mapping dictionary for standard CRM fields.
 */
export const SYNONYM_DICTIONARY: Record<string, string[]> = {
  data_source: ["campaign", "campaign name", "campaign source", "lead source", "source", "marketing campaign", "marketing source", "facebook campaign", "facebook ads", "google ads", "google campaign", "project", "property", "society", "tower", "development", "scheme", "builder project", "residential project"],
  description: ["ad set", "ad group", "ad name", "creative", "advertisement", "listing", "unit description", "property description"],
  crm_status: ["lead status", "status", "crm status", "sales status", "sales stage", "lead stage", "customer status"],
  possession_time: ["possession", "expected possession", "handover", "delivery", "completion", "ready to move", "move in", "move-in date"],
  crm_note: ["remarks", "comments", "notes", "observation", "feedback", "follow up", "follow-up", "additional info", "summary"],
  lead_owner: ["owner", "sales executive", "sales rep", "relationship manager", "assigned to", "rm", "agent"],
  company: ["company", "organisation", "organization", "builder", "developer", "firm", "enterprise", "business"],
  city: ["city", "town", "location", "municipality"],
  state: ["state", "province", "region"],
  country: ["country", "nation"],
  email: ["email", "mail", "email address", "primary email", "customer email"],
  mobile_without_country_code: ["phone", "mobile", "mobile number", "primary contact", "contact", "contact number", "reach me", "cell", "telephone"],
  name: ["name", "customer name", "buyer name", "prospect", "prospect name", "full name", "lead name"],
  created_at: ["created", "created at", "submitted at", "submission date", "lead date"],
};
