import type { Metadata } from 'next';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/api';
import SurfaceCalculator from '@/components/SurfaceCalculator';
import JsonLd from '@/components/JsonLd';
import { DEFAULT_OG_IMAGE, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Wall Panel & Marble Sheet Calculator',
  description:
    'Free surface area calculator: work out how many marble sheets, fluted panels, PU stone panels or sticker rolls you need, in metres, feet or cm.',
  alternates: { canonical: '/calculator' },
  openGraph: {
    title: 'Wall Panel & Marble Sheet Calculator',
    description: 'Work out exactly how many sheets, panels or rolls your walls need, with cost.',
    url: '/calculator',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function CalculatorPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-brand-bg">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Calculator', url: '/calculator' },
        ])}
      />
      <section className="bg-brand-deep pb-14 pt-36 text-white">
        <div className="mx-auto max-w-content px-5">
          <span className="eyebrow">Free Tool</span>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold sm:text-5xl">
            Wall Panel &amp; Marble Sheet Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Find out exactly how many marble sheets, fluted panels, PU stone panels or sticker rolls your walls need, and
            what they will cost, before you buy.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-14">
        <SurfaceCalculator whatsapp={settings.whatsapp} />
      </section>

      <section className="bg-white py-16">
        <div className="prose-article mx-auto max-w-3xl px-5">
          <h2>How the calculator counts</h2>
          <p>
            Every product has its real size built in, because the size changes the count. A 9ft x 4ft sheet covers about
            3.3m², a 60cm x 120cm PU stone panel 0.72m² and a 2.9m x 16cm fluted panel 0.46m², so the same wall needs very
            different quantities of each.
          </p>
          <ul>
            <li>
              <strong>Sheets and boards</strong> are laid out on each wall the way an installer would, upright or sideways,
              whichever uses fewer. The top band and the last column are cut from offcuts, which are shared across walls.
            </li>
            <li>
              <strong>Fluted panels</strong> are fixed upright, so the count is one column per panel width.
            </li>
            <li>
              <strong>Sticker rolls</strong> are counted like wallpaper: wall-height strips, and how many strips each roll
              gives.
            </li>
            <li>
              <strong>Doors and windows</strong> only reduce the count by the whole pieces they actually save.
            </li>
            <li>
              <strong>Spares</strong> are added on top for cuts and breakages. 10% is a safe default; use 15% for walls with
              many sockets or angles.
            </li>
          </ul>
          <p>
            For worked examples and measuring tips, read our{' '}
            <Link href="/articles/wall-panel-quantity-calculator-measure-calculate-and-plan-your-project">
              guide to measuring walls for panels
            </Link>
            . Planning a whole room or building? Start with our{' '}
            <Link href="/articles/why-interior-design-comes-before-execution">interior design process</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
