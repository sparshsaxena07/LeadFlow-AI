export interface HeaderMapping {
  originalHeader: string;
  normalizedHeader: string;
  mappedField: string;
  confidence: number;
  matchingMethod: "dictionary" | "similarity" | "ai_assisted" | "unknown";
  reason: string;
}
