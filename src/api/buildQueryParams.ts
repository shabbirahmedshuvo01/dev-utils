export type QueryValue =
  | string | number | boolean | null | undefined
  | QueryValue[] | { [key: string]: QueryValue };

export interface BuildQueryParamsOptions {
  arrayFormat?: "repeat" | "brackets" | "comma";
  skipNull?: boolean;
  skipEmptyString?: boolean;
}

function append(
  params: URLSearchParams,
  key: string,
  value: QueryValue,
  options: Required<BuildQueryParamsOptions>
) {
  if (value === undefined || (options.skipNull && value === null)) return;
  if (value === "" && options.skipEmptyString) return;

  if (Array.isArray(value)) {
    if (options.arrayFormat === "comma") {
      params.append(key, value.map(String).join(","));
    } else {
      value.forEach(item =>
        append(params, options.arrayFormat === "brackets" ? `${key}[]` : key, item, options)
      );
    }
    return;
  }

  if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([childKey, childValue]) =>
      append(params, `${key}[${childKey}]`, childValue, options)
    );
    return;
  }

  params.append(key, String(value));
}

export function buildQueryParams(
  input: Record<string, QueryValue>,
  options: BuildQueryParamsOptions = {}
): string {
  const normalized: Required<BuildQueryParamsOptions> = {
    arrayFormat: options.arrayFormat ?? "repeat",
    skipNull: options.skipNull ?? true,
    skipEmptyString: options.skipEmptyString ?? true
  };

  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => append(params, key, value, normalized));

  const result = params.toString();
  return result ? `?${result}` : "";
}