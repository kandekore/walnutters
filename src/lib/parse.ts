/** Safely parse a JSON string column into a typed array, defaulting to []. */
export function parseArray<T = string>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/** Safely parse a JSON object column, defaulting to null. */
export function parseObject<T = Record<string, unknown>>(
  value: string | null | undefined
): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
