/**
 * Normalizes a raw CSV header to a standard comparison format:
 * Lowercases, replaces spaces/underscores/hyphens with single spaces, and removes punctuation.
 */
export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[_\-\s]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}
