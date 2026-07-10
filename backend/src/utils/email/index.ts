/**
 * Future Responsibility:
 * Provide email string sanitizers and domain validations.
 */

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
