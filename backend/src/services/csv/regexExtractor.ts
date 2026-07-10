export class RegexExtractor {
  // Matches typical email addresses
  private emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  // Matches dialing country code codes (e.g. +91, +1, +44)
  private countryCodePattern = /\+\d{1,4}\b/g;

  // Matches ISO 8601 dates (e.g. YYYY-MM-DD or full datetime strings)
  private isoDatePattern = /\b\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?\b/g;

  // Matches sequences of numbers typical of phone numbers (allowing dashes, spaces, brackets)
  private phonePattern = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g;

  /**
   * Scans a list of text values to extract matching identifiers.
   * Leverages Set definitions to prevent duplicate entries.
   */
  extract(values: string[]): {
    emails: string[];
    phoneNumbers: string[];
    countryCodes: string[];
    detectedDates: string[];
  } {
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const countryCodes = new Set<string>();
    const detectedDates = new Set<string>();

    values.forEach((value) => {
      if (!value) return;

      // 1. Scan emails
      const emailMatches = value.match(this.emailPattern);
      if (emailMatches) {
        emailMatches.forEach((match) => emails.add(match.trim()));
      }

      // 2. Scan country codes
      const ccMatches = value.match(this.countryCodePattern);
      if (ccMatches) {
        ccMatches.forEach((match) => countryCodes.add(match.trim()));
      }

      // 3. Scan ISO dates
      const dateMatches = value.match(this.isoDatePattern);
      if (dateMatches) {
        dateMatches.forEach((match) => detectedDates.add(match.trim()));
      }

      // 4. Scan phone numbers
      const phoneMatches = value.match(this.phonePattern);
      if (phoneMatches) {
        phoneMatches.forEach((match) => {
          const trimmed = match.trim();
          // Filter out short country codes or dates
          if (trimmed.startsWith("+") && trimmed.length <= 5) {
            return;
          }
          if (/\d{4}-\d{2}-\d{2}/.test(trimmed)) {
            return; // Matches the date pattern, skip
          }
          // Minimum digit check to avoid small numbers
          const digitsOnly = trimmed.replace(/\D/g, "");
          if (digitsOnly.length >= 7 && digitsOnly.length <= 15) {
            phoneNumbers.add(trimmed);
          }
        });
      }
    });

    return {
      emails: Array.from(emails),
      phoneNumbers: Array.from(phoneNumbers),
      countryCodes: Array.from(countryCodes),
      detectedDates: Array.from(detectedDates),
    };
  }
}
