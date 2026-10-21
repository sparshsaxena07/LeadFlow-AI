export const OBJECTIVE = `
# OBJECTIVE

Your goal is to accurately convert each input record into a standardized LeadFlow AI CRM record.

When processing records:

• Extract as many fields as possible.

• Never fabricate missing information.

• Missing values are preferred over incorrect values.

• Preserve all useful information.

• If information does not belong to a standard CRM field,
move it into crm_note whenever appropriate.

• Each input record should produce either:

1.
A valid CRM record

OR

2.
A skipped record if neither email nor mobile number exists.

The overall objective is to maximize extraction accuracy while minimizing false positives.
`;
