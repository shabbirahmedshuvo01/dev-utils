export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
}

export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debounced = ((...args: Parameters<T>) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      const argsToUse = lastArgs;
      lastArgs = undefined;
      if (argsToUse) fn(...argsToUse);
    }, Math.max(0, wait));
  }) as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    lastArgs = undefined;
  };

  debounced.flush = () => {
    if (!timer) return;
    clearTimeout(timer);
    timer = undefined;
    const argsToUse = lastArgs;
    lastArgs = undefined;
    if (argsToUse) fn(...argsToUse);
  };

  return debounced;
}