import type { SetNonNullable } from "type-fest"

import { def } from "#ext/stdlib/existence"

/**
 * Returns a copy of {@link obj} with `null` and `undefined` properties filtered out.
 */
export function compact<T extends object>(obj: T): SetNonNullable<T> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (def(value as T[keyof T])) result[key] = value
  }
  return result as SetNonNullable<T>
}

/**
 * Calls {@link fn} for each {@link key} and {@link value} in {@link obj}.
 */
export function forEach<T extends object>(
  obj: T,
  fn: (key: keyof T, value: T[keyof T]) => void,
): void {
  for (const [key, value] of Object.entries(obj)) {
    fn(key as keyof T, value as T[keyof T])
  }
}

/**
 * Maps {@link fn} for each {@link key} and {@link value} in {@link obj}.
 */
export function map<T extends object, R>(obj: T, fn: (key: keyof T, value: T[keyof T]) => R): R[] {
  const results = new Array<R>()
  for (const [key, value] of Object.entries(obj)) {
    results.push(fn(key as keyof T, value as T[keyof T]))
  }
  return results
}

/**
 * Returns a copy of {@link obj} with only the given {@link keys}.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (keys.includes(key as K)) result[key] = value
  }
  return result as Pick<T, K>
}
