export interface RetryAsyncOptions {
  retries?: number;
  minDelay?: number;
  maxDelay?: number;
  factor?: number;
  shouldRetry?: (error: unknown, attempt: number) => boolean | Promise<boolean>;
  onRetry?: (error: unknown, attempt: number, delay: number) => void | Promise<void>;
}

export async function retryAsync<T>(
  operation: () => Promise<T>,
  options: RetryAsyncOptions = {}
): Promise<T> {
  const retries = Math.max(0, options.retries ?? 3);
  const minDelay = Math.max(0, options.minDelay ?? 250);
  const maxDelay = Math.max(minDelay, options.maxDelay ?? 10_000);
  const factor = Math.max(1, options.factor ?? 2);

  let attempt = 0;

  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= retries) throw error;
      attempt++;

      if (options.shouldRetry && !(await options.shouldRetry(error, attempt))) throw error;

      const delay = Math.min(maxDelay, minDelay * Math.pow(factor, attempt - 1));
      await options.onRetry?.(error, attempt, delay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}