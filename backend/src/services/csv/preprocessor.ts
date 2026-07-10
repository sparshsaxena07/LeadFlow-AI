import { NormalizedCSVRecord } from "@/models/NormalizedCSVRecord";
import { PreprocessedRecord, PreprocessedMetadata } from "@/models/PreprocessedRecord";
import { HeaderAnalyzer } from "./headerAnalyzer";
import { RegexExtractor } from "./regexExtractor";

export class Preprocessor {
  private headerAnalyzer = new HeaderAnalyzer();
  private regexExtractor = new RegexExtractor();

  /**
   * Enriches NormalizedCSVRecord list with analytical metadata, returning PreprocessedRecord[].
   */
  preprocess(records: NormalizedCSVRecord[]): PreprocessedRecord[] {
    if (records.length === 0) {
      return [];
    }

    // 1. Analyze the column headers from the first record keys
    const headers = Object.keys(records[0].normalized);
    const headerAnalysis = this.headerAnalyzer.analyze(headers);

    // 2. Construct preprocessed metadata per row
    return records.map((record) => {
      const cellValues: string[] = [];

      Object.values(record.normalized).forEach((value) => {
        if (value !== null && value !== undefined) {
          cellValues.push(value);
        }
      });

      const valueExtractions = this.regexExtractor.extract(cellValues);

      const metadata: PreprocessedMetadata = {
        emails: valueExtractions.emails,
        phoneNumbers: valueExtractions.phoneNumbers,
        countryCodes: valueExtractions.countryCodes,
        detectedDates: valueExtractions.detectedDates,
        possibleNameColumns: headerAnalysis.nameColumns,
        possibleCompanyColumns: headerAnalysis.companyColumns,
        possiblePhoneColumns: headerAnalysis.phoneColumns,
        possibleNoteColumns: headerAnalysis.noteColumns,
        unknownColumns: headerAnalysis.unknownColumns,
      };

      return {
        rowNumber: record.rowNumber,
        normalized: record.normalized,
        metadata,
      };
    });
  }
}
