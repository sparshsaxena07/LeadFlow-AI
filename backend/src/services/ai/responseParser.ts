/**
 * Classification types for AI response parsing errors.
 */
export type ResponseParserErrorType = "EMPTY_RESPONSE" | "INVALID_JSON" | "UNEXPECTED_STRUCTURE";

/**
 * Custom error class returned during AI response decoding failures.
 */
export class ResponseParserError extends Error {
  constructor(
    public type: ResponseParserErrorType,
    message: string,
  ) {
    super(message);
    this.name = "ResponseParserError";
  }
}

export class ResponseParser {
  /**
   * Decodes raw text output from the model, raising specific failures
   * if empty, invalid JSON, or not representing an object containing records and skipped arrays.
   */
  parse(responseContent: string | undefined | null): { records: unknown[]; skipped: unknown[] } {
    // 1. Empty response check
    if (!responseContent) {
      throw new ResponseParserError("EMPTY_RESPONSE", "Model response is empty or undefined.");
    }

    let cleanedContent = responseContent.trim();
    if (cleanedContent === "") {
      throw new ResponseParserError("EMPTY_RESPONSE", "Model response consists of whitespace only.");
    }

    // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ... ```)
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.replace(/^```[a-zA-Z]*\s*/, "");
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.replace(/\s*```$/, "");
    }
    cleanedContent = cleanedContent.trim();

    if (cleanedContent === "") {
      throw new ResponseParserError("EMPTY_RESPONSE", "Model response contains only empty code blocks.");
    }

    // 2. JSON parsing
    let decoded: unknown;
    try {
      decoded = JSON.parse(cleanedContent);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid syntax";
      throw new ResponseParserError(
        "INVALID_JSON",
        `Failed to parse response as JSON: ${errorMsg}. Cleaned content size: ${cleanedContent.length} bytes. Sample: ${cleanedContent.substring(0, 100)}`,
      );
    }

    // 3. Structural validation (expected object containing records and skipped arrays)
    if (typeof decoded !== "object" || decoded === null) {
      throw new ResponseParserError(
        "UNEXPECTED_STRUCTURE",
        "Expected response payload to represent a JSON object.",
      );
    }

    const obj = decoded as Record<string, unknown>;

    if (!("records" in obj) || !Array.isArray(obj.records)) {
      throw new ResponseParserError(
        "UNEXPECTED_STRUCTURE",
        "Expected response object to contain a 'records' array.",
      );
    }

    const skipped = "skipped" in obj && Array.isArray(obj.skipped) ? obj.skipped : [];

    return {
      records: obj.records,
      skipped,
    };
  }
}
