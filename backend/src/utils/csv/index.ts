/**
 * Future Responsibility:
 * House low-level formatting operations specific to CSV formatting,
 * such as sanitizing quote encodings and escaping characters.
 */

export function sanitizeCSVCell(cell: string): string {
  return cell.trim();
}
