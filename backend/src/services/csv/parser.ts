import Papa from "papaparse";
import { RawCSVRecord } from "@/models/RawCSVRecord";

export class CSVParser {
  /**
   * Parses raw CSV text content using Papa Parse.
   * Filters out completely empty rows, preserves original headers, and returns RawCSVRecord[].
   */
  parse(rawCSV: string): RawCSVRecord[] {
    const parseResult = Papa.parse<Record<string, string>>(rawCSV, {
      header: true,
      skipEmptyLines: false, // Set to false so we can track row number indices correctly
    });

    const rawRecords: RawCSVRecord[] = [];
    const fields = parseResult.meta.fields || [];

    parseResult.data.forEach((row, index) => {
      // Row numbers: Header is row 1, first data row is index 0 -> row 2.
      const rowNumber = index + 2;

      // Identify if the row is completely empty (no keys or all values are empty/whitespace)
      const keys = Object.keys(row);
      const isRowEmpty =
        keys.length === 0 ||
        keys.every((key) => {
          const val = row[key];
          return val === undefined || val === null || val.trim() === "";
        });

      if (isRowEmpty) {
        return; // Ignore empty rows
      }

      const raw: Record<string, string | null> = {};
      fields.forEach((field) => {
        const val = row[field];
        raw[field] = val !== undefined ? val : null;
      });

      rawRecords.push({
        rowNumber,
        raw,
      });
    });

    return rawRecords;
  }
}
