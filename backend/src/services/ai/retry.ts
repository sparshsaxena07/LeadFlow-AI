import { MAX_RETRIES } from "@/shared/constants/ai";

/**
 * Generic decorator to retry any asynchronous function execution.
 * Incorporates options for max attempts count, base delay in milliseconds,
 * and standard exponential backoff scaling.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelayMs: number = 1000,
  useExponential: boolean = true,
): Promise<T> {
  let attempts = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      if (attempts > maxRetries) {
        throw err; // Out of attempts, raise final failure
      }

      // Calculate delay using baseDelayMs * 2^(attempts - 1)
      const waitTime = useExponential
        ? baseDelayMs * Math.pow(2, attempts - 1)
        : baseDelayMs;

      console.warn(
        `[Retry Alert]: Attempt ${attempts} failed. Retrying operation in ${waitTime}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}
