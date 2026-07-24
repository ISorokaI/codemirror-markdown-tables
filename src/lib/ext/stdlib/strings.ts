/**
 * Returns true if {@link value} is empty.
 */
export function isEmpty(value: string): boolean {
  return value.length === 0
}

/**
 * Returns {@link value} if it is not empty, nil otherwise.
 */
export function nilIfEmpty(value: string): string | undefined {
  return value.length === 0 ? undefined : value
}

/**
 * Returns true if {@link value} is a string.
 */
export function isString(value: unknown): value is string {
  return typeof value === "string"
}
