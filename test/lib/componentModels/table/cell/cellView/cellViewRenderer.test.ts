import { Text } from "@codemirror/state"
import type { Highlighter } from "@lezer/highlight"
import { describe, expect, it } from "vitest"

import * as CellViewRenderer from "#componentModels/table/cell/cellView/cellViewRenderer"

// eslint-disable-next-line unicorn/no-null -- Highlighter.style() returns `string | null`
const noopHighlighter: Highlighter = { style: () => null }

describe("render", () => {
  it("renders plain text unchanged without decorateCell", () => {
    const html = CellViewRenderer.render(Text.of(["hello world"]), noopHighlighter)
    expect(html).toBe("hello world")
  })

  it("hides a range and wraps a mark range in a class, mimicking Decoration.replace/mark", () => {
    // Cell text `[[Target]]`: hide the `[[`/`]]` markers, mark `Target` as a link.
    const html = CellViewRenderer.render(Text.of(["[[Target]]"]), noopHighlighter, () => [
      { type: "hide", from: 0, to: 2 },
      { type: "mark", from: 2, to: 8, class: "cm-wikilink" },
      { type: "hide", from: 8, to: 10 },
    ])
    expect(html).toBe('<span class="cm-wikilink">Target</span>')
  })

  it("clips decoration ranges to each line and keeps unaffected lines untouched", () => {
    const html = CellViewRenderer.render(Text.of(["**bold**", "plain"]), noopHighlighter, () => [
      { type: "hide", from: 0, to: 2 },
      { type: "mark", from: 2, to: 6, class: "cm-bold" },
      { type: "hide", from: 6, to: 8 },
    ])
    expect(html).toBe('<span class="cm-bold">bold</span><span data-br>\n</span>plain')
  })

  it("drops the whole cell text when decorateCell returns no ranges", () => {
    const html = CellViewRenderer.render(Text.of(["hi"]), noopHighlighter, () => [])
    expect(html).toBe("hi")
  })
})
