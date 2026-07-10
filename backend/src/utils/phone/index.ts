/**
 * Future Responsibility:
 * Validate and normalize international phone formats (e.g. converting input
 * strings to strict E.164 strings).
 */

export function isValidE164Phone(phone: string): boolean {
  // Placeholder regex check
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}
