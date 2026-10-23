'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { PRODUCTS, UNIT_TO_M, type ProductKind, type Unit } from '@/lib/products';
import { calculateCoverage } from '@/lib/coverage';

type Row = { id: number; width: string; height: string };
type OpeningRow = Row & { count: string };

const UNITS: Unit[] = ['m', 'ft', 'cm'];
const WASTE = [0, 5, 10, 15];
const CUSTOM = 'custom';

const num = (s: string) => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`;
const fmt = (n: number, d = 2) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('en-NG');

/** Convert a typed value between units, keeping what the visitor meant. */
function convert(value: string, from: Unit, to: Unit): string {
  const n = num(value);
  if (!n || from === to) return value;
  const v = (n * UNIT_TO_M[from]) / UNIT_TO_M[to];
  return String(Math.round(v * (to === 'cm' ? 10 : 100)) / (to === 'cm' ? 10 : 100));
}


const inputCls =
  'w-full border border-brand-ink/15 bg-white px-3 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20';
const labelCls = 'mb-1 block text-xs font-semibold text-brand-muted';

export default function SurfaceCalculator({ whatsapp }: { whatsapp?: string }) {
  // Row ids live per component (not module-level) so server and browser render the same ids.
  const nextId = useRef(1);
  const newRow = (): Row => ({ id: nextId.current++, width: '', height: '' });
  const [unit, setUnit] = useState<Unit>('m');
  const [walls, setWalls] = useState<Row[]>([{ id: 0, width: '', height: '' }]);
  const [openings, setOpenings] = useState<OpeningRow[]>([]);
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [waste, setWaste] = useState(10);
  // Custom item: each side has its own unit, so "2ft x 1.2m" works.
  const [custom, setCustom] = useState({
    width: '',
    widthUnit: 'ft' as Unit,
    length: '',
    lengthUnit: 'm' as Unit,
    kind: 'sheet' as ProductKind,
    price: '',
  });

  const product = PRODUCTS.find((p) => p.id === productId);
  const item =
    productId === CUSTOM
      ? {
          width: num(custom.width) * UNIT_TO_M[custom.widthUnit],
          length: num(custom.length) * UNIT_TO_M[custom.lengthUnit],
          kind: custom.kind,
        }
      : { width: product!.width, length: product!.length, kind: product!.kind };
  const price = productId === CUSTOM ? num(custom.price) || null : product!.price;
  const unitName = productId === CUSTOM ? (custom.kind === 'roll' ? 'roll' : 'piece') : product!.unitName;
  const itemLabel =
    productId === CUSTOM
      ? `custom item ${custom.width || '?'}${custom.widthUnit} x ${custom.length || '?'}${custom.lengthUnit}`
      : `${product!.name} (${product!.size})`;

  const k = UNIT_TO_M[unit];
  const result = useMemo(
    () =>
      calculateCoverage(
        walls.map((w) => ({ width: num(w.width) * k, height: num(w.height) * k })),
        openings.map((o) => ({ width: num(o.width) * k, height: num(o.height) * k, count: Math.round(num(o.count)) })),
        item,
        waste,
      ),
    // item is rebuilt each render from primitive state; list its fields explicitly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [walls, openings, k, item.width, item.length, item.kind, waste],
  );

  const changeUnit = (to: Unit) => {
    setWalls((ws) => ws.map((w) => ({ ...w, width: convert(w.width, unit, to), height: convert(w.height, unit, to) })));
    setOpenings((os) =>
      os.map((o) => ({ ...o, width: convert(o.width, unit, to), height: convert(o.height, unit, to) })),
    );
    setUnit(to);
  };

  const plural = (n: number) => `${unitName}${n === 1 ? '' : 's'}`;
  const ready = result.netArea > 0 && result.pieceArea > 0;
  const cost = ready && price ? result.total * price : null;

  const waText = ready
    ? [
        'Hello Nasuru Interiors, I used the calculator on your website.',
        `Product: ${itemLabel}`,
        ...walls
          .filter((w) => num(w.width) && num(w.height))
          .map((w, i) => `Wall ${i + 1}: ${w.width}${unit} wide x ${w.height}${unit} high`),
        ...openings
          .filter((o) => num(o.width) && num(o.height))
          .map((o) => `Door/window: ${o.width}${unit} x ${o.height}${unit} (x${o.count || 1})`),
        `Net area: ${fmt(result.netArea)} m²`,
        `Quantity: ${result.total} ${plural(result.total)} (${result.needed} + ${result.spares} spare)`,
        'Please confirm the price and delivery.',
      ].join('\n')
    : 'Hello Nasuru Interiors, I need help working out how many panels I need.';
  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}` : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      {/* Inputs */}
      <div className="space-y-7 border border-brand-ink/8 bg-white p-6 shadow-soft sm:p-8">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">1. Measure in</legend>
          <div className="flex gap-2">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => changeUnit(u)}
                className={`min-w-[64px] border px-4 py-2 text-sm font-semibold transition-colors ${
                  unit === u
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-ink/15 text-brand-ink hover:border-brand-primary'
                }`}
              >
                {u === 'm' ? 'Metres' : u === 'ft' ? 'Feet' : 'Cm'}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">2. Your walls ({unit})</legend>
          <div className="space-y-3">
            {walls.map((w, i) => (
              <div key={w.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                <div>
                  <label htmlFor={`w-${w.id}`} className={labelCls}>
                    Wall {i + 1} width
                  </label>
                  <input
                    id={`w-${w.id}`}
                    inputMode="decimal"
                    className={inputCls}
                    value={w.width}
                    placeholder={unit === 'm' ? '3.5' : unit === 'ft' ? '12' : '350'}
                    onChange={(e) => setWalls((ws) => ws.map((x) => (x.id === w.id ? { ...x, width: e.target.value } : x)))}
                  />
                </div>
                <div>
                  <label htmlFor={`h-${w.id}`} className={labelCls}>
                    Height
                  </label>
                  <input
                    id={`h-${w.id}`}
                    inputMode="decimal"
                    className={inputCls}
                    value={w.height}
                    placeholder={unit === 'm' ? '2.7' : unit === 'ft' ? '9' : '270'}
                    onChange={(e) => setWalls((ws) => ws.map((x) => (x.id === w.id ? { ...x, height: e.target.value } : x)))}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove wall ${i + 1}`}
                  disabled={walls.length === 1}
                  onClick={() => setWalls((ws) => ws.filter((x) => x.id !== w.id))}
                  className="flex h-[42px] w-[42px] items-center justify-center border border-brand-ink/15 text-brand-muted hover:text-brand-ink disabled:opacity-30"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setWalls((ws) => [...ws, newRow()])}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
          >
            <Plus size={16} aria-hidden="true" /> Add another wall
          </button>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">3. Doors and windows to leave out ({unit})</legend>
          {openings.length === 0 && <p className="text-sm text-brand-muted">None added. Add any door, window or opening you won&apos;t cover.</p>}
          <div className="space-y-3">
            {openings.map((o, i) => (
              <div key={o.id} className="grid grid-cols-[1fr_1fr_70px_auto] items-end gap-3">
                <div>
                  <label htmlFor={`ow-${o.id}`} className={labelCls}>
                    Opening {i + 1} width
                  </label>
                  <input
                    id={`ow-${o.id}`}
                    inputMode="decimal"
                    className={inputCls}
                    value={o.width}
                    onChange={(e) => setOpenings((os) => os.map((x) => (x.id === o.id ? { ...x, width: e.target.value } : x)))}
                  />
                </div>
                <div>
                  <label htmlFor={`oh-${o.id}`} className={labelCls}>
                    Height
                  </label>
                  <input
                    id={`oh-${o.id}`}
                    inputMode="decimal"
                    className={inputCls}
                    value={o.height}
                    onChange={(e) => setOpenings((os) => os.map((x) => (x.id === o.id ? { ...x, height: e.target.value } : x)))}
                  />
                </div>
                <div>
                  <label htmlFor={`oc-${o.id}`} className={labelCls}>
                    How many
                  </label>
                  <input
                    id={`oc-${o.id}`}
                    inputMode="numeric"
                    className={inputCls}
                    value={o.count}
                    onChange={(e) => setOpenings((os) => os.map((x) => (x.id === o.id ? { ...x, count: e.target.value } : x)))}
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Remove opening ${i + 1}`}
                  onClick={() => setOpenings((os) => os.filter((x) => x.id !== o.id))}
                  className="flex h-[42px] w-[42px] items-center justify-center border border-brand-ink/15 text-brand-muted hover:text-brand-ink"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setOpenings((os) => [...os, { ...newRow(), count: '1' }])}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:underline"
          >
            <Plus size={16} aria-hidden="true" /> Add a door or window
          </button>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">4. Product</legend>
          <label htmlFor="calc-product" className="sr-only">
            Product
          </label>
          <select id="calc-product" className={inputCls} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}, {p.size}
                {p.price ? ` (${naira(p.price)})` : ''}
              </option>
            ))}
            <option value={CUSTOM}>Another size (enter your own)</option>
          </select>

          {productId === CUSTOM && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(['width', 'length'] as const).map((side) => {
                const unitKey = side === 'width' ? 'widthUnit' : 'lengthUnit';
                return (
                  <div key={side}>
                    <label htmlFor={`c-${side}`} className={labelCls}>
                      Item {side === 'width' ? 'width' : 'length (height on the wall)'}
                    </label>
                    <div className="flex">
                      <input
                        id={`c-${side}`}
                        inputMode="decimal"
                        className={inputCls}
                        value={custom[side]}
                        onChange={(e) => setCustom((c) => ({ ...c, [side]: e.target.value }))}
                      />
                      <label htmlFor={`c-${side}-u`} className="sr-only">
                        Unit for item {side}
                      </label>
                      <select
                        id={`c-${side}-u`}
                        className="border border-l-0 border-brand-ink/15 bg-brand-bg px-2 text-sm text-brand-ink"
                        value={custom[unitKey]}
                        onChange={(e) => setCustom((c) => ({ ...c, [unitKey]: e.target.value as Unit }))}
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
              <div>
                <label htmlFor="c-kind" className={labelCls}>
                  Type
                </label>
                <select
                  id="c-kind"
                  className={inputCls}
                  value={custom.kind}
                  onChange={(e) => setCustom((c) => ({ ...c, kind: e.target.value as ProductKind }))}
                >
                  <option value="sheet">Sheet or board (can turn sideways)</option>
                  <option value="strip">Upright panel (fluted, strips)</option>
                  <option value="roll">Roll (stickers, wallpaper)</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-price" className={labelCls}>
                  Price per item in ₦ (optional)
                </label>
                <input
                  id="c-price"
                  inputMode="numeric"
                  className={inputCls}
                  value={custom.price}
                  onChange={(e) => setCustom((c) => ({ ...c, price: e.target.value }))}
                />
              </div>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-brand-ink">5. Spares for cuts and breakages</legend>
          <div className="flex flex-wrap gap-2">
            {WASTE.map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={waste === w}
                onClick={() => setWaste(w)}
                className={`border px-4 py-2 text-sm font-semibold transition-colors ${
                  waste === w
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-ink/15 text-brand-ink hover:border-brand-primary'
                }`}
              >
                {w === 0 ? 'None' : `${w}%`}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Result */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="bg-brand-deep p-6 text-white shadow-card sm:p-8" aria-live="polite">
          <p className="text-xs font-bold uppercase tracking-wider2 text-brand-gold">You need</p>
          {ready ? (
            <>
              <p className="mt-2 font-serif text-5xl font-semibold">
                {result.total} <span className="text-2xl">{plural(result.total)}</span>
              </p>
              <p className="mt-2 text-sm text-white/80">
                {result.needed} to cover the walls
                {result.spares > 0 ? ` + ${result.spares} spare for cuts and breakages` : ''}.
              </p>
              <dl className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/75">Wall area</dt>
                  <dd>{fmt(result.grossArea)} m² ({fmt(result.grossArea / 0.092903, 1)} ft²)</dd>
                </div>
                {result.openingArea > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-white/75">Doors and windows</dt>
                    <dd>− {fmt(result.openingArea)} m²</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 font-semibold">
                  <dt>Area to cover</dt>
                  <dd>{fmt(result.netArea)} m² ({fmt(result.netArea / 0.092903, 1)} ft²)</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/75">Each {unitName} covers</dt>
                  <dd>{fmt(result.pieceArea)} m²</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/15 pt-3 text-base font-semibold">
                  <dt>Estimated material cost</dt>
                  <dd>{cost ? naira(cost) : 'Price on request'}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-white/70">
                Adhesive, sealant, trims, delivery and installation are not included. We count the way installers cut,
                reusing offcuts across walls, so confirm the final quantity with us before you buy.
              </p>
            </>
          ) : (
            <p className="mt-3 text-white/80">
              Enter the width and height of at least one wall to see how many{' '}
              {productId === CUSTOM ? 'items' : `${product!.unitName}s`} you need.
            </p>
          )}

          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-6 w-full"
            >
              {ready ? 'Send this list to us on WhatsApp' : 'Ask us on WhatsApp'}
            </a>
          )}
        </div>
        {product?.guide && (
          <p className="mt-4 text-sm text-brand-muted">
            Sizes, finishes and prices:{' '}
            <Link href={product.guide} className="font-semibold text-brand-primary hover:underline">
              {product.name} guide
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
