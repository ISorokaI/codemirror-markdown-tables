import type { Text } from "@codemirror/state"

/**
 * A range in a cell's text that {@link MarkdownTablesConfig.decorateCell} wants rendered
 * specially in the **cell view** (the read-only representation shown when the cell isn't selected).
 *
 * This is a narrow, string-based subset of CodeMirror's decoration model — just enough to
 * mimic a `Decoration.mark` (add a CSS class over a range) or a `Decoration.replace` with
 * an empty widget (hide a range, e.g. Markdown marker characters like `**` or `[[`).
 * There's no widget-rendering support since the cell view has no live DOM/EditorView to mount one in.
 */
export type DecoratedRange =
  | { readonly type: "mark"; readonly from: number; readonly to: number; readonly class: string }
  | { readonly type: "hide"; readonly from: number; readonly to: number }

/**
 * Computes {@link DecoratedRange}s to overlay on a table cell's **cell view**.
 *
 * Called once per cell, with the cell's full (unsanitized, multi-line) text.
 * Ranges use offsets into {@link cellText}; ranges outside a given line, or spanning
 * multiple lines, are clipped to each line when rendering.
 */
export type DecorateCell = (cellText: Text) => readonly DecoratedRange[]
