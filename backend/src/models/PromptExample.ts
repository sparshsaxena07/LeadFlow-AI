/**
 * Model interface representing a structured few-shot prompt example.
 */
export interface PromptExample {
  title: string;
  learningObjective: string;
  input: Record<string, unknown>;
  output: {
    records: Record<string, unknown>[];
    skipped: {
      rowNumber: number;
      reason: string;
    }[];
  };
}
