export function convertTimezone(
  value: string | Date | number,
  timeZone: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Invalid date");
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "medium",
    ...options,
    timeZone,
  }).format(date);
}