import { PromptContext } from "@/models/PromptContext";
import { PromptPayload } from "@/models/PromptPayload";
import { IDENTITY } from "./identity";
import { OBJECTIVE } from "./objective";
import { CONSTRAINTS } from "./constraints";
import { EXTRACTION_RULES } from "./rules";
import { ALLOWED_VALUES } from "./allowedValues";
import { OUTPUT_SCHEMA } from "./schema";
import { OUTPUT_INSTRUCTIONS } from "./output";
import { formatExamples } from "./formatter";

/**
 * Builds the final prompt string dispatched to the LLM.
 * Aggregates role role directives, targets, strict rules, examples, and the CSV rows context payload.
 */
export function buildPrompt(context: PromptContext): string {
  // Structure the payload matching the PromptPayload interface
  const payload: PromptPayload = {
    metadata: {
      batchNumber: context.batchNumber,
      totalBatches: context.totalBatches,
      totalRows: context.totalRows,
      originalHeaders: context.originalHeaders,
      detectedColumns: context.detectedColumns,
    },
    records: context.records,
  };

  return `
${IDENTITY}

--------------------------------------------------

${OBJECTIVE}

--------------------------------------------------

${CONSTRAINTS}

--------------------------------------------------

${EXTRACTION_RULES}

--------------------------------------------------

${ALLOWED_VALUES}

--------------------------------------------------

${OUTPUT_SCHEMA}

--------------------------------------------------

${OUTPUT_INSTRUCTIONS}

--------------------------------------------------

# FEW SHOT EXAMPLES

${formatExamples()}

--------------------------------------------------

# PROMPT PAYLOAD

${JSON.stringify(payload, null, 2)}
`;
}
