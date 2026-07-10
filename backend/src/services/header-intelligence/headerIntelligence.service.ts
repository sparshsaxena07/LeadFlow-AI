import { HeaderMapping } from "./types";
import { normalizeHeader } from "./normalizer";
import { SYNONYM_DICTIONARY } from "./dictionary";
import { calculateJaroWinkler } from "./similarity";

export class HeaderIntelligenceService {
  private similarityThreshold = 0.75;
  private aiAssistedThreshold = 0.60;

  /**
   * Evaluates a list of CSV headers and maps them to CRM fields.
   */
  analyzeHeaders(headers: string[]): HeaderMapping[] {
    return headers.map((header) => {
      const normalizedHeader = normalizeHeader(header);

      // Stage 2: Dictionary Match
      let dictionaryField: string | null = null;
      let matchedSynonym = "";
      Object.keys(SYNONYM_DICTIONARY).forEach((crmField) => {
        const synonyms = SYNONYM_DICTIONARY[crmField];
        if (synonyms.includes(normalizedHeader)) {
          dictionaryField = crmField;
          matchedSynonym = normalizedHeader;
        }
      });

      if (dictionaryField) {
        return {
          originalHeader: header,
          normalizedHeader,
          mappedField: dictionaryField,
          confidence: 1.0,
          matchingMethod: "dictionary",
          reason: `Matched known ${matchedSynonym} synonym.`,
        };
      }

      // Stage 3 & 4: Similarity Match & AI Assisted Match
      let bestField = "UNKNOWN";
      let bestSynonym = "";
      let maxSimilarity = 0;

      Object.keys(SYNONYM_DICTIONARY).forEach((crmField) => {
        const synonyms = SYNONYM_DICTIONARY[crmField];
        synonyms.forEach((synonym) => {
          const score = calculateJaroWinkler(normalizedHeader, synonym);
          if (score > maxSimilarity) {
            maxSimilarity = score;
            bestField = crmField;
            bestSynonym = synonym;
          }
        });
      });

      const confidence = Math.round(maxSimilarity * 100) / 100;

      if (maxSimilarity >= this.similarityThreshold) {
        return {
          originalHeader: header,
          normalizedHeader,
          mappedField: bestField,
          confidence,
          matchingMethod: "similarity",
          reason: `Closest semantic match with '${bestSynonym}'.`,
        };
      }

      if (maxSimilarity >= this.aiAssistedThreshold) {
        return {
          originalHeader: header,
          normalizedHeader,
          mappedField: bestField,
          confidence,
          matchingMethod: "ai_assisted",
          reason: `Weak semantic match with '${bestSynonym}'; mapping will be assisted by AI during extraction.`,
        };
      }

      // Stage 5: Unknown Header
      return {
        originalHeader: header,
        normalizedHeader,
        mappedField: "UNKNOWN",
        confidence,
        matchingMethod: "unknown",
        reason: "No deterministic CRM mapping found. This column will still be available to the AI during extraction.",
      };
    });
  }
}
