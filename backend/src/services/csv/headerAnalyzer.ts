import { DetectedColumns } from "@/models/DetectedColumns";

export class HeaderAnalyzer {
  /**
   * Evaluates each CSV header to map its semantic role deterministically.
   * Scans for names, companies, phones, emails, dates, and notes keywords.
   */
  analyze(headers: string[]): DetectedColumns {
    const emailColumns: string[] = [];
    const phoneColumns: string[] = [];
    const nameColumns: string[] = [];
    const companyColumns: string[] = [];
    const noteColumns: string[] = [];
    const dateColumns: string[] = [];
    const unknownColumns: string[] = [];

    headers.forEach((header) => {
      const normalizedHeader = header.toLowerCase().trim();

      // Match emails
      if (
        normalizedHeader.includes("email") ||
        normalizedHeader.includes("mail") ||
        normalizedHeader.includes("gmail")
      ) {
        emailColumns.push(header);
      }
      // Match phones
      else if (
        normalizedHeader.includes("phone") ||
        normalizedHeader.includes("mobile") ||
        normalizedHeader.includes("contact") ||
        normalizedHeader.includes("tel") ||
        normalizedHeader.includes("cell") ||
        normalizedHeader.includes("whatsapp")
      ) {
        phoneColumns.push(header);
      }
      // Match names
      else if (
        normalizedHeader.includes("name") ||
        normalizedHeader.includes("customer") ||
        normalizedHeader.includes("client") ||
        normalizedHeader.includes("lead")
      ) {
        nameColumns.push(header);
      }
      // Match company details
      else if (
        normalizedHeader.includes("company") ||
        normalizedHeader.includes("firm") ||
        normalizedHeader.includes("organization") ||
        normalizedHeader.includes("employer") ||
        normalizedHeader.includes("business") ||
        normalizedHeader.includes("org")
      ) {
        companyColumns.push(header);
      }
      // Match notes / remarks
      else if (
        normalizedHeader.includes("note") ||
        normalizedHeader.includes("remark") ||
        normalizedHeader.includes("comment") ||
        normalizedHeader.includes("desc") ||
        normalizedHeader.includes("feedback")
      ) {
        noteColumns.push(header);
      }
      // Match dates
      else if (
        normalizedHeader.includes("date") ||
        normalizedHeader.includes("created") ||
        normalizedHeader.includes("time") ||
        normalizedHeader.includes("timestamp")
      ) {
        dateColumns.push(header);
      }
      // Everything else falls into unknownColumns
      else {
        unknownColumns.push(header);
      }
    });

    return {
      emailColumns,
      phoneColumns,
      nameColumns,
      companyColumns,
      noteColumns,
      dateColumns,
      unknownColumns,
    };
  }
}
