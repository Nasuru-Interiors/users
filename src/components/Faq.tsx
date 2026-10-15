import { FAQS } from '@/lib/faq';

/** Accessible, zero-JS accordion using native <details>/<summary>. */
export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-brand-ink/8 bg-white px-6 py-1 shadow-soft open:shadow-card"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-serif text-lg font-semibold text-brand-ink marker:content-none">
            {item.q}
            {/* CSS "+" instead of an SVG icon per question: same look, far less markup. */}
            <span
              aria-hidden="true"
              className="shrink-0 font-sans text-3xl font-light leading-none text-brand-gold transition-transform duration-300 before:content-['+'] group-open:rotate-45"
            />
          </summary>
          <p className="pb-5 leading-relaxed text-brand-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
