'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { PRODUCTS, UNIT_TO_M, type Unit } from '@/lib/products';
import { calculateCoverage } from '@/lib/coverage';

const UNITS: Unit[] = ['m', 'ft', 'cm'];
const SPARES = 10;

const num = (s: string) => {
  const n = parseFloat(s.replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`;

function convert(value: string, from: Unit, to: Unit): string {
  const n = num(value);
  if (!n || from === to) return value;
  const v = (n * UNIT_TO_M[from]) / UNIT_TO_M[to];
  const p = to === 'cm' ? 10 : 100;
  return String(Math.round(v * p) / p);
}

const inputCls =
  'w-full border border-brand-ink/15 bg-white px-3 py-2.5 text-sm text-brand-ink focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20';
const labelCls = 'mb-1 block text-xs font-semibold text-brand-muted';

/**
 * Compact one-wall calculator for the hero. The full version (several walls, doors and
 * windows, custom sizes) lives at /calculator and opens pre-filled with these values.
 */
export default function QuickCalculator({ whatsapp }: { whatsapp?: string }) {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [unit, setUnit] = useState<Unit>('m');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const product = PRODUCTS.find((p) => p.id === productId)!;
  const k = UNIT_TO_M[unit];
  const result = useMemo(
    () =>
      calculateCoverage(
        [{ width: num(width) * k, height: num(height) * k }],
        [],
        { width: product.width, length: product.length, kind: product.kind },
        SPARES,
      ),
    [width, height, k, product],
  );
  const ready = result.total > 0;
  const hasWidth = num(width) > 0;
  const hasHeight = num(height) > 0;
  const plural = (n: number) => `${product.unitName}${n === 1 ? '' : 's'}`;

  const changeUnit = (to: Unit) => {
    setWidth((v) => convert(v, unit, to));
    setHeight((v) => convert(v, unit, to));
    setUnit(to);
  };

  const fullHref = `/calculator?p=${product.id}&u=${unit}${width ? `&w=${encodeURIComponent(width)}` : ''}${
    height ? `&h=${encodeURIComponent(height)}` : ''
  }`;
  const waText = ready
    ? [
        'Hello Nasuru Interiors, I used your calculator.',
        `Product: ${product.name} (${product.size})`,
        `Wall: ${width}${unit} wide x ${height}${unit} high`,
        `Area: ${result.netArea.toFixed(2)} m²`,
        `Quantity: ${result.total} ${plural(result.total)} (${result.needed} needed + ${result.spares} spare)`,
        product.price !== null ? `Estimated material cost: ${naira(result.total * product.price)}` : 'Price: on request',
        'Please confirm the final price and delivery.',
      ].join('\n')
    : '';
  const waHref = whatsapp && ready ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}` : null;

  return (
    <div className="w-full border border-white/10 bg-white p-5 text-brand-ink shadow-card sm:p-6">
      <p className="flex items-center gap-2 font-serif text-xl font-semibold">
        <Calculator size={20} className="text-brand-primary" aria-hidden="true" />
        Quick wall estimate
      </p>
      <p className="mt-1 text-sm leading-relaxed text-brand-muted">
        Get a material estimate for one wall. We include 10% extra for cuts.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <label htmlFor="qc-product" className={labelCls}>
            Product
          </label>
          <select id="qc-product" className={inputCls} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}, {p.size}
                {p.price !== null ? ` · ${naira(p.price)}/${p.unitName}` : ' · price on request'}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={labelCls}>Measure in</legend>
          <div className="flex gap-1.5">
            {UNITS.map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => changeUnit(u)}
                className={`min-h-11 flex-1 border px-2 py-2 text-xs font-semibold transition-colors ${
                  unit === u
                    ? 'border-brand-primary bg-brand-primary text-white'
                    : 'border-brand-ink/15 hover:border-brand-primary'
                }`}
              >
                {u === 'm' ? 'Metres' : u === 'ft' ? 'Feet' : 'Cm'}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="qc-width" className={labelCls}>
              Wall width ({unit})
            </label>
            <input
              id="qc-width"
              inputMode="decimal"
              className={inputCls}
              value={width}
              autoComplete="off"
              placeholder={unit === 'm' ? '3.5' : unit === 'ft' ? '12' : '350'}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="qc-height" className={labelCls}>
              Wall height ({unit})
            </label>
            <input
              id="qc-height"
              inputMode="decimal"
              className={inputCls}
              value={height}
              autoComplete="off"
              placeholder={unit === 'm' ? '2.7' : unit === 'ft' ? '9' : '270'}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 bg-brand-bg p-4" aria-live="polite" aria-atomic="true">
        {ready ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Estimated quantity</p>
            <p className="mt-1 font-serif text-3xl font-semibold text-brand-ink">
              {result.total} <span className="text-lg">{plural(result.total)}</span>
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              {result.needed} to cover the wall + {result.spares} spare · {result.netArea.toFixed(2)} m²
            </p>
            <div className="mt-3 border-t border-brand-ink/10 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Estimated material cost</p>
              <p className="mt-1 text-lg font-semibold text-brand-ink">
                {product.price !== null ? `About ${naira(result.total * product.price)}` : 'Price on request'}
              </p>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-brand-muted">
              Materials only; final quantity and price may vary. Excludes delivery and installation.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-brand-muted">
            {hasWidth || hasHeight
              ? 'Add the wall’s width and height to see your estimated quantity and cost.'
              : 'Enter the wall’s width and height to see your estimated quantity and cost.'}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {waHref && (
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
            Send this to us on WhatsApp
          </a>
        )}
        <Link href={fullHref} className="text-center text-sm font-semibold text-brand-primary hover:underline">
          Calculate multiple walls and openings →
        </Link>
      </div>
    </div>
  );
}
