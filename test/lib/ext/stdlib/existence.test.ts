import { describe, expect, it } from "vitest"

import { def, nil } from "#ext/stdlib/existence"

describe("def", () => {
  it("returns true when defined", () => {
    expect(def("")).toBe(true)
  })
  it("returns false when null", () => {
    // eslint-disable-next-line unicorn/no-null -- Testing null
    expect(def(null)).toBe(false)
  })
  it("returns false when undefined", () => {
    expect(def(undefined)).toBe(false)
  })
})

describe("nil", () => {
  it("returns true when null", () => {
    // eslint-disable-next-line unicorn/no-null -- Testing null
    expect(nil(null)).toBe(true)
  })
  it("returns true when undefined", () => {
    expect(nil(undefined)).toBe(true)
  })
  it("returns false when defined", () => {
    expect(nil(0)).toBe(false)
  })
})
