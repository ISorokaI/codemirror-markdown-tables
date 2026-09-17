export interface CellViewElement {
  /** Start offset within the line (0-based), for overlaying {@link DecoratedRange}s. */
  from: number
  /** End offset within the line (0-based), for overlaying {@link DecoratedRange}s. */
  to: number
  textContent: string
  classes: string[] | undefined
}

export type CellViewElementLine = CellViewElement[]
