import productData from '../data/surface-products.json';

// Edit src/data/surface-products.json to add products or update dimensions and prices.
// Product dimensions are in metres, prices are in naira, and null means price on request.

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
  material?: string;
  origin?: string;
  /** Thickness in millimetres. */
  thicknessMm?: number;
  /** Price guide for this product, if there is one. */
  guide?: string;
}

export function describeProduct(product: Product): string {
  const details: string[] = [];
  if (product.thicknessMm !== undefined) details.push(`${product.thicknessMm}mm`);
  if (product.origin) details.push(product.origin);
  if (product.material) details.push(product.material);
  return `${product.name}, ${product.size}${details.length ? ` · ${details.join(' · ')}` : ''}`;
}

const isProductKind = (kind: string): kind is ProductKind =>
  kind === 'sheet' || kind === 'strip' || kind === 'roll';

export const PRODUCTS: Product[] = productData.map((product) => {
  if (!isProductKind(product.kind)) {
    throw new Error(`Unknown product kind "${product.kind}" for calculator product "${product.id}".`);
  }
  if (
    !product.id ||
    !product.name ||
    !product.size ||
    !product.unitName ||
    !Number.isFinite(product.width) ||
    product.width <= 0 ||
    !Number.isFinite(product.length) ||
    product.length <= 0 ||
    (product.price !== null && (!Number.isFinite(product.price) || product.price < 0)) ||
    (product.thicknessMm !== undefined &&
      (!Number.isFinite(product.thicknessMm) || product.thicknessMm <= 0))
  ) {
    throw new Error(`Invalid dimensions or price for calculator product "${product.id}".`);
  }

  return { ...product, kind: product.kind };
});

export type Unit = 'm' | 'cm' | 'ft';

const FT = 0.3048;

export const UNIT_TO_M: Record<Unit, number> = { m: 1, cm: 0.01, ft: FT };

export const UNIT_LABEL: Record<Unit, string> = { m: 'metres', cm: 'centimetres', ft: 'feet' };
