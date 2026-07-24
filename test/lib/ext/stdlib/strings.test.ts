import { describe, expect, it } from "vitest"

import * as Strings from "#ext/stdlib/strings"

describe("isEmpty", () => {
  it("returns true when empty", () => {
    expect(Strings.isEmpty("")).toBe(true)
  })
  it("returns false when not empty", () => {
    expect(Strings.isEmpty(" ")).toBe(false)
  })
})

describe("nilIfEmpty", () => {
  it("returns nil when empty", () => {
    expect(Strings.nilIfEmpty("")).toBeUndefined()
  })
  it("returns string when not empty", () => {
    expect(Strings.nilIfEmpty(" ")).toBe(" ")
  })
})

describe("isString", () => {
  it("returns true when string", () => {
    expect(Strings.isString("")).toBe(true)
  })
  it("returns false when not string", () => {
    expect(Strings.isString(1)).toBe(false)
  })
})
