/**
 * Returns true if the given {@link value} exists (is neither `undefined` nor `null`).
 *
 * Short replacement for somewhat unclean `if (value != null)` checks and `null`
 * and unsafe `if (value)` checks which use coercion and match `""`, `0`, and `NaN` as well.
 *
 * Coercion to boolean and mixing `null` and `undefined` often lead to hard-to-spot bugs.
 *
 * The opposite of {@link nil}.
 */
export function def<T>(value: T): value is NonNullable<T> {
  // eslint-disable-next-line unicorn/no-null -- Used to treat nulls and undefined the same
  return value != null
}

/**
 * Returns true if the given {@link value} doesn't exist (is `undefined` or `null`).
 *
 * Short replacement for somewhat unclean `if (value == null)` checks
 * or unsafe `if (!value)` checks which use coercion and match `""`, `0`, and `NaN` as well.
 *
 * Coercion to boolean and mixing `null` and `undefined` often lead to hard-to-spot bugs.
 *
 * The opposite of {@link def}.
 */
export function nil<T>(value: T): value is Extract<T, null | undefined> {
  // eslint-disable-next-line unicorn/no-null -- Used to treat nulls and undefined the same
  return value == null
}
