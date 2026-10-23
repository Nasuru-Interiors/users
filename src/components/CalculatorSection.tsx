import SurfaceCalculator from '@/components/SurfaceCalculator';

/** Homepage block for the surface area calculator. */
export default function CalculatorSection({ whatsapp }: { whatsapp?: string }) {
  return (
    <section id="calculator" className="scroll-mt-24 bg-white py-20">
      <div className="mx-auto max-w-content px-5">
        <div className="mb-10 max-w-2xl">
          <span className="eyebrow">Surface Area Calculator</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
            How Many Sheets or Panels Do You Need?
          </h2>
          <p className="mt-3 leading-relaxed text-brand-muted">
            Enter your wall sizes in metres, feet or centimetres, take out doors and windows, and pick a product.
            Each product has its real size built in, so a 9ft x 4ft sheet, a 60cm x 120cm PU stone panel and a 2.9m
            fluted panel all give the right count for your wall.
          </p>
        </div>
        <SurfaceCalculator whatsapp={whatsapp} />
      </div>
    </section>
  );
}
