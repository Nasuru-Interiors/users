// Product constants for the surface area calculator. Sizes are stored in metres.
// Prices are Nasuru Interiors' current prices (naira per piece/roll); null = "price on request".
// Keep these in step with the price guides when prices change.

export type ProductKind =
  /** Rigid sheet or board: counted by how many fit across and up each wall. */
  | 'sheet'
  /** Strip panel fixed upright (fluted): counted as vertical columns. */
  | 'strip'
  /** Roll (stickers): counted like wallpaper, as wall-height drops per roll. */
  | 'roll';

export interface Product {
  id: string;
  name: string;
  /** Human size label shown in the list, e.g. "8ft x 4ft". */
  size: string;
  /** Width across the wall when fixed upright, in metres. */
  width: number;
  /** Length (height when fixed upright), in metres. For rolls, the roll length. */
  length: number;
  kind: ProductKind;
  /** Price per piece or roll in naira; null when the price isn't published. */
  price: number | null;
  unitName: string;
  /** Price guide for this product, if there is one. */
  guide?: string;
}

const FT = 0.3048;

export const PRODUCTS: Product[] = [
  {
    id: 'uv-marble-8x4',
    name: 'UV / PVC marble sheet',
    size: '8ft x 4ft',
    width: 4 * FT,
    length: 8 * FT,
    kind: 'sheet',
    price: 45000,
    unitName: 'sheet',
    guide: '/articles/price-of-marble-sheets-in-nigeria-lagos-2026',
  },
  {
    id: 'uv-marble-9x4',
    name: 'PVC marble sheet',
    size: '9ft x 4ft',
    width: 4 * FT,
    length: 9 * FT,
    kind: 'sheet',
    price: null,
    unitName: 'sheet',
    guide: '/articles/9ft-by-4ft-pvc-marble-sheet-3mm-size-uses-and-installation-guide',
  },
  {
    id: 'acrylic-marble-8x4',
    name: 'Acrylic marble board',
    size: '8ft x 4ft',
    width: 4 * FT,
    length: 8 * FT,
    kind: 'sheet',
    price: 65000,
    unitName: 'board',
    guide: '/articles/price-of-acrylic-marble-board-in-nigeria-lagos-2026',
  },
  {
    id: 'acrylic-mirror-10x4',
    name: 'Acrylic mirror board',
    size: '10ft x 4ft',
    width: 4 * FT,
    length: 10 * FT,
    kind: 'sheet',
    price: null,
    unitName: 'board',
  },
  {
    id: 'foam-panel-2x9',
    name: 'Foam sheet wall panel',
    size: '2ft x 9ft',
    width: 2 * FT,
    length: 9 * FT,
    kind: 'sheet',
    price: null,
    unitName: 'panel',
  },
  {
    id: 'pu-stone-60x120',
    name: 'PU stone wall panel',
    size: '60cm x 120cm',
    width: 0.6,
    length: 1.2,
    kind: 'sheet',
    price: 25000,
    unitName: 'panel',
    guide: '/articles/price-of-pu-stone-wall-panels-in-nigeria-lagos-2026',
  },
  {
    id: 'fluted-wpc-290x16',
    name: 'Fluted wall panel (WPC)',
    size: '2.9m x 16cm',
    width: 0.16,
    length: 2.9,
    kind: 'strip',
    price: 5500,
    unitName: 'panel',
    guide: '/articles/price-of-fluted-wall-panels-in-nigeria-lagos-2026',
  },
  {
    id: 'marble-sticker-60x300',
    name: 'Marble sticker roll',
    size: '60cm x 3m',
    width: 0.6,
    length: 3,
    kind: 'roll',
    price: 3000,
    unitName: 'roll',
    guide: '/articles/price-of-marble-stickers-in-nigeria-lagos-2026',
  },
  {
    id: 'self-adhesive-60x1000',
    name: 'Self-adhesive marble sticker roll',
    size: '60cm x 10m',
    width: 0.6,
    length: 10,
    kind: 'roll',
    price: 20000,
    unitName: 'roll',
    guide: '/articles/price-of-self-adhesive-marble-stickers-in-nigeria-lagos-2026',
  },
];

export type Unit = 'm' | 'cm' | 'ft';

export const UNIT_TO_M: Record<Unit, number> = { m: 1, cm: 0.01, ft: FT };

export const UNIT_LABEL: Record<Unit, string> = { m: 'metres', cm: 'centimetres', ft: 'feet' };
