export function getErrorMessage(error: unknown, fallback = "An unknown error occurred"): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error === "object" && error !== null) {
    const value = (error as Record<string, unknown>).message;
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}