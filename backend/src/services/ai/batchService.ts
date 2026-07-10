import { DEFAULT_BATCH_SIZE } from "@/shared/constants/ai";

export class BatchService {
  /**
   * Splits an array of objects into chunks of a configurable size.
   * Default batch size is loaded from AI constants (20).
   */
  chunk<T>(
    records: T[],
    batchSize: number = DEFAULT_BATCH_SIZE,
  ): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < records.length; i += batchSize) {
      batches.push(records.slice(i, i + batchSize));
    }
    return batches;
  }
}
