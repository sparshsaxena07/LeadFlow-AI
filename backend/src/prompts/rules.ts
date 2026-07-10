export const EXTRACTION_RULES = `
# EXTRACTION RULES

Process every input record independently.

Each input record must produce exactly one output decision in the "records" array (unless skipped).

Never reorder records. Never merge multiple input rows.

--------------------------------------------------

## RECORD SKIPPING

Skip the record ONLY when BOTH are missing:
- email
- mobile number (or phone number)

If at least one exists, do not skip.

--------------------------------------------------

## ROW NUMBER BINDING

Every extracted CRM record in the "records" array MUST include the "rowNumber" property exactly matching the "rowNumber" of the input CSV row. This is critical for matching outputs to inputs. Never invent or reorder row numbers.

--------------------------------------------------

## FIELD MAPPING

Column names are not fixed. Infer semantic meaning of columns:
- Name: Client Name, Lead Name, Customer Name, Contact Person, Full Name -> name
- Email: Email Address, Primary Email, Customer Email -> email
- Phone: Mobile, Phone, Contact Number, Cell, WhatsApp -> mobile
- Notes: Remarks, Comments, Observation, Special Requests -> crm_note
- Company: Organization, Business, Firm, Employer -> company
- Lead Source: Campaign, Source, Origin -> data_source

--------------------------------------------------

## PHONE EXTRACTION & SPLITTING

Always separate dialing country code from the mobile number:
- Input: "+91 9876543210" or "+91-9876543210"
  - country_code: "+91"
  - mobile_without_country_code: "9876543210"
- Input: "9876543210" (No country prefix)
  - country_code: null
  - mobile_without_country_code: "9876543210"

If multiple phone numbers exist in the record:
- Use only the first phone number for the primary mapping.
- Append all remaining phone numbers into crm_note (e.g. "Additional phone: +91 9988776655").

--------------------------------------------------

## EMAIL EXTRACTION

Validate email format. If invalid, set email to null.
If multiple email addresses exist in the record:
- Use only the first email as the primary mapping.
- Append all remaining email addresses into crm_note (e.g. "Additional emails: secondary@work.com").

--------------------------------------------------

## DATE EXTRACTION

If a valid creation date exists, return it in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ). If no valid date exists, return null. Never invent dates.

--------------------------------------------------

## LOCATION & COMPANY

- Extract city, state, country independently. Do not infer missing locations.
- Extract company name. Never guess.

--------------------------------------------------

## CRM NOTES VS DESCRIPTION

To keep the CRM organized, separate comments from metadata:

- crm_note: Must contain remarks, comments, follow-up instructions, observations, special requests, and additional contact information (like extra phone numbers/emails). Do NOT store structured metadata here if another field exists.
- description: Must be used for metadata that does not naturally belong elsewhere.
  - Examples of metadata for description: Ad Set, Campaign Name, Budget, Property Type, Occupation, Industry, Product, Source Notes.
  - Do NOT duplicate information already stored in crm_note.

--------------------------------------------------

## CONFIDENCE SCORE

Include the "confidence" field as a floating-point number between 0 and 1, representing your mapping confidence:
- 0.99: Direct header/value match
- 0.85: Confident semantic inference
- 0.60: Weak or partial inference
- Set to null if unable to estimate.

--------------------------------------------------

## EMPTY VALUES

Unknown fields must be set to null. Never invent placeholders like "N/A", "Unknown", "-", or "None".

--------------------------------------------------

## CSV COMPATIBILITY

Output must remain valid JSON. Escape quote symbols and newlines correctly.
`;
