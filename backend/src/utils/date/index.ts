/**
 * Future Responsibility:
 * Parse varied date formats from raw CSV strings and output standard ISO 8601 timestamps.
 */

export function toISODate(dateStr: string): string | null {
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? null : new Date(parsed).toISOString();
}
