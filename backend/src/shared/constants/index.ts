/**
 * Future Responsibility:
 * Keep shared global constants such as limit parameters, default config schemas,
 * and error codes.
 */

export const SYSTEM_LIMITS = {
  MAX_CSV_ROWS: 50000,
  BATCH_SIZE_DEFAULT: 100,
  MAX_CONCURRENT_LLM_REQUESTS: 5,
} as const;
