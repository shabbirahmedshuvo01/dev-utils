export interface FormatIsoStringOptions {
  locale?: string;
  timeZone?: string;
  dateStyle?: Intl.DateTimeFormatOptions["dateStyle"];
  timeStyle?: Intl.DateTimeFormatOptions["timeStyle"];
}

export function formatIsoString(
  value: string | Date | number,
  options: FormatIsoStringOptions = {}
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid date");

  const formatter = new Intl.DateTimeFormat(options.locale, {
    dateStyle: options.dateStyle ?? "medium",
    timeStyle: options.timeStyle,
    timeZone: options.timeZone
  });

  return formatter.format(date);
}

export function formatRelativeTime(
  value: string | Date | number,
  locale = "en",
  now = Date.now()
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid date");

  const seconds = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  let unit: Intl.RelativeTimeFormatUnit = "second";
  let amount = seconds;

  if (abs >= 31536000) { unit = "year"; amount = Math.round(seconds / 31536000); }
  else if (abs >= 2592000) { unit = "month"; amount = Math.round(seconds / 2592000); }
  else if (abs >= 86400) { unit = "day"; amount = Math.round(seconds / 86400); }
  else if (abs >= 3600) { unit = "hour"; amount = Math.round(seconds / 3600); }
  else if (abs >= 60) { unit = "minute"; amount = Math.round(seconds / 60); }

  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(amount, unit);
}