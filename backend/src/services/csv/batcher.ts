/**
 * Future Responsibility:
 * Segment the parsed CSV files into sequential pages or operational batches
 * to avoid memory exhaustion during large database exports or API calls.
 */

export class CSVBatcher {
  batch<T>(records: T[], size: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < records.length; i += size) {
      batches.push(records.slice(i, i + size));
    }
    return batches;
  }
}
