export interface MaskDataOptions {
  keys?: string[];
  mask?: string;
  visibleStart?: number;
  visibleEnd?: number;
}

const DEFAULT_SENSITIVE_KEYS = [
  "password", "passwd", "token", "accessToken", "refreshToken",
  "authorization", "jwt", "secret", "apiKey", "cookie"
];

function maskString(value: string, mask: string, visibleStart: number, visibleEnd: number): string {
  if (!value) return value;
  if (value.length <= visibleStart + visibleEnd) return mask.repeat(Math.max(1, value.length));
  return value.slice(0, visibleStart) + mask.repeat(Math.max(3, value.length - visibleStart - visibleEnd)) + value.slice(-visibleEnd);
}

export function maskData<T>(
  input: T,
  options: MaskDataOptions = {}
): T {
  const keys = new Set((options.keys ?? DEFAULT_SENSITIVE_KEYS).map(k => k.toLowerCase()));
  const mask = options.mask ?? "*";
  const visibleStart = Math.max(0, options.visibleStart ?? 2);
  const visibleEnd = Math.max(0, options.visibleEnd ?? 2);

  const visit = (value: unknown, key?: string): unknown => {
    if (key && keys.has(key.toLowerCase())) {
      return typeof value === "string"
        ? maskString(value, mask, visibleStart, visibleEnd)
        : "[REDACTED]";
    }

    if (Array.isArray(value)) return value.map(item => visit(item));
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([entryKey, entryValue]) => [entryKey, visit(entryValue, entryKey)])
      );
    }
    return value;
  };

  return visit(input) as T;
}