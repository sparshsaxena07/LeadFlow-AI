export const ALLOWED_VALUES = `
# ALLOWED ENUM VALUES

## CRM Status

Only the following values are allowed:

- GOOD_LEAD_FOLLOW_UP
- DID_NOT_CONNECT
- BAD_LEAD
- SALE_DONE

CRITICAL: If there is NOT enough evidence to confidently determine one of the allowed CRM statuses, return null. Do NOT guess. Only produce one of the allowed values when there is explicit evidence in the comments/remarks.

Explicit Evidence Mapping Rules:
- "Interested", "Call tomorrow" or similar active follow-up -> GOOD_LEAD_FOLLOW_UP
- "Busy now", "No Answer", "Didn't Pick", "Call Later" -> DID_NOT_CONNECT
- "Not Interested", "Rejected", "Spam", "Invalid lead" -> BAD_LEAD
- "Purchased", "Deal Closed", "Sale Complete", "Paid" -> SALE_DONE

If there is no matching explicit evidence, set crm_status to null.

--------------------------------------------------

## Data Source

Only the following values are allowed:

- leads_on_demand
- meridian_tower
- eden_park
- varah_swamy
- sarjapur_plots

CRITICAL: Improve semantic mapping based on variation keywords:
- "Meridian Tower", "Meridian", "Meridian Project", "meridian_tower" -> meridian_tower
- "Eden Park", "Eden", "eden_park" -> eden_park
- "Sarjapur", "Sarjapur Layout", "Sarjapur Plots", "sarjapur_plots" -> sarjapur_plots

If confidence is low or no matches exist, return null. Do NOT invent new source names.

--------------------------------------------------

## Country Code

Always preserve '+' when available.

Examples:
+91
+1
+44

If unavailable, set country_code to null.

--------------------------------------------------

## Mobile Number

Store only the mobile number digits without the country code prefix.

Example:
Input: +91 9876543210
Output:
- country_code: "+91"
- mobile_without_country_code: "9876543210"
`;
