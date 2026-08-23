export interface CleanObjectOptions {
  removeNull?: boolean;
  removeUndefined?: boolean;
  removeEmptyString?: boolean;
  removeEmptyArrays?: boolean;
  removeEmptyObjects?: boolean;
}

export function cleanObject<T extends Record<string, unknown>>(
  object: T,
  options: CleanObjectOptions = {}
): Partial<T> {
  const config = {
    removeNull: options.removeNull ?? true,
    removeUndefined: options.removeUndefined ?? true,
    removeEmptyString: options.removeEmptyString ?? true,
    removeEmptyArrays: options.removeEmptyArrays ?? false,
    removeEmptyObjects: options.removeEmptyObjects ?? false
  };

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    if (value === null && config.removeNull) continue;
    if (value === undefined && config.removeUndefined) continue;
    if (value === "" && config.removeEmptyString) continue;
    if (Array.isArray(value) && value.length === 0 && config.removeEmptyArrays) continue;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const cleaned = cleanObject(value as Record<string, unknown>, options);
      if (Object.keys(cleaned).length === 0 && config.removeEmptyObjects) continue;
      output[key] = cleaned;
      continue;
    }

    output[key] = value;
  }

  return output as Partial<T>;
}