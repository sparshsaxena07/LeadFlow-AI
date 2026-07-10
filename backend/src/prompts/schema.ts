export const OUTPUT_SCHEMA = `
# OUTPUT SCHEMA

Return exactly one JSON object.

Structure:

{
  "records": [
    {
      "rowNumber": number,
      "created_at": string | null,
      "name": string | null,
      "email": string | null,
      "country_code": string | null,
      "mobile_without_country_code": string | null,
      "company": string | null,
      "city": string | null,
      "state": string | null,
      "country": string | null,
      "lead_owner": string | null,
      "crm_status": string | null,
      "crm_note": string | null,
      "data_source": string | null,
      "possession_time": string | null,
      "description": string | null,
      "confidence": number | null
    }
  ],

  "skipped": [
    {
      "rowNumber": number,
      "reason": string
    }
  ]
}

Do not add additional properties.

Do not rename properties.

Do not omit properties.

Every CRM record must contain every property.

Unknown values must be null.
`;
