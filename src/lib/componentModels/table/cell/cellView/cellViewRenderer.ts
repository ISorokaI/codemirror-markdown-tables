import type { Text } from "@codemirror/state"
import type { Highlighter } from "@lezer/highlight"

import * as HtmlTags from "#ext/dom/htmlTags"
import * as Arrays from "#ext/stdlib/arrays"
import { def } from "#ext/stdlib/existence"

import type { DecorateCell, DecoratedRange } from "#api/decoratedRange"

import type {
  CellViewElement,
  CellViewElementLine,
} from "#componentModels/table/cell/cellView/cellViewElement"
import * as CellViewParser from "#componentModels/table/cell/cellView/cellViewParser"

import * as TextSanitizer from "#core/textSanitizer"

export function render(cell: Text, highlighter: Highlighter, decorateCell?: DecorateCell): string {
  const elementLines = CellViewParser.parse(cell, highlighter)
  if (!def(decorateCell)) return toHtml(elementLines)

  const text = TextSanitizer.unsanitize(cell)
  const ranges = decorateCell(text)
  if (ranges.length === 0) return toHtml(elementLines)

  const decoratedLines = elementLines.map((elementLine, index) => {
    const lineNum = index + 1
    if (lineNum > text.lines) return elementLine
    const line = text.line(lineNum)
    const localRanges = rangesForLine(ranges, line.from, line.to)
    return localRanges.length === 0 ? elementLine : applyDecoratedRanges(elementLine, localRanges)
  })
  return toHtml(decoratedLines)
}

function rangesForLine(
  ranges: readonly DecoratedRange[],
  lineFrom: number,
  lineTo: number,
): DecoratedRange[] {
  const localRanges: DecoratedRange[] = []
  for (const range of ranges) {
    const from = Math.max(range.from, lineFrom) - lineFrom
    const to = Math.min(range.to, lineTo) - lineFrom
    if (from >= to) continue
    localRanges.push({ ...range, from, to })
  }
  return localRanges
}

/**
 * Splits {@link elementLine} at every {@link ranges} boundary: drops text under a `"hide"`
 * range, and appends the `"mark"` class to elements it covers. Mirrors how CodeMirror itself
 * merges `Decoration.replace`/`Decoration.mark` with syntax-highlight classes when rendering
 * a real editor — just done here over a static element list instead of a live document.
 */
function applyDecoratedRanges(
  elementLine: CellViewElementLine,
  ranges: readonly DecoratedRange[],
): CellViewElementLine {
  const breakpoints = new Set<number>()
  for (const element of elementLine) {
    breakpoints.add(element.from)
    breakpoints.add(element.to)
  }
  for (const range of ranges) {
    breakpoints.add(range.from)
    breakpoints.add(range.to)
  }
  const points = [...breakpoints].sort((a, b) => a - b)

  const result: CellViewElementLine = []
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i]
    const to = points[i + 1]

    const covering = elementLine.find((element) => element.from <= from && element.to >= to)
    if (!def(covering)) continue

    const hidden = ranges.some(
      (range) => range.type === "hide" && range.from <= from && range.to >= to,
    )
    if (hidden) continue

    const extraClasses = ranges
      .filter((range) => range.type === "mark" && range.from <= from && range.to >= to)
      .map((range) => (range as { class: string }).class)

    const textContent = covering.textContent.slice(from - covering.from, to - covering.from)
    if (textContent.length === 0) continue

    result.push({
      from,
      to,
      textContent,
      classes: Arrays.nilIfEmpty([...(covering.classes ?? []), ...extraClasses]),
    })
  }
  return result
}

function toHtml(elementLines: CellViewElementLine[]): string {
  return elementLines
    .map((elementLine) => elementLine.map(elementToHtml).join(""))
    .join("<span data-br>\n</span>")
}

function elementToHtml({ textContent, classes }: CellViewElement): string {
  return def(classes)
    ? `<span class="${classes.join(" ")}">${HtmlTags.escapeContent(textContent)}</span>`
    : HtmlTags.escapeContent(textContent)
}
