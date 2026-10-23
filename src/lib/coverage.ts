import type { ProductKind } from './products';

// Quantity maths for the surface area calculator. All lengths in metres.
//
// How pieces are counted (the way an installer cuts):
//  - sheet: full pieces fill the wall; the narrow top band and the last column are cut from
//    whole pieces, and those offcut strips are pooled across all walls. Each wall is tried
//    with the item upright and sideways, and the cheaper layout is used.
//  - strip (fluted): upright only; one column per panel width, cut-offs reused up the column.
//  - roll (stickers): wallpaper method, wall-height drops, so many drops per roll.
// Whole pieces that a door or window really saves are then taken off, and the result is never
// below net area ÷ piece area. Spares (waste %) are added on top and reported separately.

export interface Rect {
  width: number;
  height: number;
}
export interface Opening extends Rect {
  count: number;
}
export interface Item {
  /** Width across the wall when fixed upright. */
  width: number;
  /** Length / height when fixed upright (roll length for rolls). */
  length: number;
  kind: ProductKind;
}

export interface CoverageResult {
  grossArea: number;
  openingArea: number;
  netArea: number;
  pieceArea: number;
  /** Pieces needed to cover the walls, before spares. */
  needed: number;
  /** Extra pieces from the waste allowance. */
  spares: number;
  /** needed + spares: what to buy. */
  total: number;
}

const EPS = 1e-9;
const up = (x: number) => Math.ceil(x - EPS);
const down = (x: number) => Math.floor(x + EPS);

/** How many strips of size `part` can be cut from a length `whole` (0 if none fits). */
const fits = (whole: number, part: number) => (part <= EPS ? Infinity : down(whole / part));

/** Fractional number of pieces to cover one wall with the item placed `across` x `up`. */
function sheetLayout(W: number, H: number, across: number, upward: number): number {
  const cols = down(W / across);
  const rows = down(H / upward);
  const remW = W - cols * across;
  const remH = H - rows * upward;
  let pieces = cols * rows;
  if (remW > EPS) {
    // Last column: `rows` strips of remW x upward, several cut from one piece.
    const perPiece = fits(across, remW);
    pieces += perPiece === 0 ? rows : rows / perPiece;
  }
  if (remH > EPS) {
    // Top band: `cols` strips of across x remH.
    const perPiece = fits(upward, remH);
    pieces += perPiece === 0 ? cols : cols / perPiece;
  }
  if (remW > EPS && remH > EPS) {
    // Corner: remW x remH.
    const perPiece = Math.max(1, fits(across, remW)) * Math.max(1, fits(upward, remH));
    pieces += 1 / perPiece;
  }
  return pieces;
}

function piecesForWall(wall: Rect, item: Item): number {
  const { width: W, height: H } = wall;
  if (W <= EPS || H <= EPS) return 0;
  const { width: w, length: l } = item;

  if (item.kind === 'roll') {
    const drops = up(W / w);
    if (H <= l + EPS) return drops / down(l / H);
    // Taller than a roll: each drop needs whole rolls plus part of another.
    return drops * (H / l);
  }
  if (item.kind === 'strip') {
    // Columns can't be shared (a ripped panel is too thin to reuse); height offcuts can.
    const cols = up(W / w);
    const full = down(H / l);
    const rem = H - full * l;
    const perColumn = full + (rem > EPS ? 1 / Math.max(1, fits(l, rem)) : 0);
    return cols * perColumn;
  }
  return Math.min(sheetLayout(W, H, w, l), sheetLayout(W, H, l, w));
}

export function calculateCoverage(
  walls: Rect[],
  openings: Opening[],
  item: Item,
  wastePercent: number,
): CoverageResult {
  const pieceArea = item.width * item.length;
  const grossArea = walls.reduce((s, w) => s + Math.max(0, w.width) * Math.max(0, w.height), 0);
  const openingArea = Math.min(
    grossArea,
    openings.reduce((s, o) => s + Math.max(0, o.width) * Math.max(0, o.height) * Math.max(0, o.count), 0),
  );
  const netArea = Math.max(0, grossArea - openingArea);

  if (pieceArea <= EPS || netArea <= EPS) {
    return { grossArea, openingArea, netArea, pieceArea, needed: 0, spares: 0, total: 0 };
  }

  const laidOut = walls.reduce((s, w) => s + piecesForWall(w, item), 0);
  const saved = down(openingArea / pieceArea);
  const needed = Math.max(up(laidOut - saved), up(netArea / pieceArea));
  const spares = wastePercent > 0 ? up((needed * wastePercent) / 100) : 0;

  return { grossArea, openingArea, netArea, pieceArea, needed, spares, total: needed + spares };
}
