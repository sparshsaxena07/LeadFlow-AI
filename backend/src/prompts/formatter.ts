import { PROMPT_EXAMPLES } from "./examples";

/**
 * Converts the few-shot CRM examples dataset into formatted prompt instructions.
 * Formats the learningObjective property instead of the deprecated reason parameter.
 */
export function formatExamples(): string {
  return PROMPT_EXAMPLES.map((example, index) => `
==================================================

Example ${index + 1}

Title:
${example.title}

Input:

${JSON.stringify(example.input, null, 2)}

Expected Output:

${JSON.stringify(example.output, null, 2)}

Why:

${example.learningObjective}

`).join("\n");
}
