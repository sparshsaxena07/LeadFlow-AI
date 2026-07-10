export const OUTPUT_INSTRUCTIONS = `
# OUTPUT INSTRUCTIONS

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT wrap the JSON inside code fences.

Do NOT explain your reasoning.

Do NOT include comments.

Do NOT include notes.

Do NOT include headings.

Do NOT include examples.

Do NOT include trailing commas.

Return a single JSON object.

The JSON must be directly parseable by:

JSON.parse(response)

Nothing should appear before or after the JSON.
`;
