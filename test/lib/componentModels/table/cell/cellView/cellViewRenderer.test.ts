import { Text } from "@codemirror/state"
import type { Highlighter } from "@lezer/highlight"
import { describe, expect, it } from "vitest"

import type { DecoratedRange } from "#api/decoratedRange"

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

  it("renders mark range with custom attributes and escapes attribute values", () => {
    const html = CellViewRenderer.render(Text.of(["`dice: 1d20`"]), noopHighlighter, () => [
      { type: "hide", from: 0, to: 7 },
      {
        type: "mark",
        from: 7,
        to: 11,
        class: "cm-dice-chip-static",
        attributes: { "data-dice-formula": '1d20"test' },
      },
      { type: "hide", from: 11, to: 12 },
    ])
    expect(html).toBe(
      '<span class="cm-dice-chip-static" data-dice-formula="1d20&quot;test">1d20</span>',
    )
  })

  it("merges attributes from overlapping mark ranges", () => {
    const html = CellViewRenderer.render(
      Text.of(["abcdef"]),
      noopHighlighter,
      (): readonly DecoratedRange[] => [
        {
          type: "mark",
          from: 1,
          to: 5,
          class: "c1",
          attributes: { "data-a": "1", "data-override": "first" },
        },
        {
          type: "mark",
          from: 2,
          to: 4,
          class: "c2",
          attributes: { "data-b": "2", "data-override": "second" },
        },
      ],
    )
    expect(html).toBe(
      'a<span class="c1" data-a="1" data-override="first">b</span>' +
        '<span class="c1 c2" data-a="1" data-override="second" data-b="2">cd</span>' +
        '<span class="c1" data-a="1" data-override="first">e</span>f',
    )
  })
})
