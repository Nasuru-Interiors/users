import Link from 'next/link';
import { getArticles, getCarousel, getHero, getSiteSettings } from '@/lib/api';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;

const FEATURES = [
  {
    title: 'Premium Aluminium',
    text: 'Long-span, weather-proof aluminium roofing sheets built for the Nigerian climate.',
  },
  {
    title: 'Supply & Installation',
    text: 'Nationwide delivery and expert installation across Lagos and beyond.',
  },
  {
    title: 'Trusted in Lagos',
    text: 'The first choice for homeowners, contractors and developers nationwide.',
  },
];

export default async function HomePage() {
  const [hero, settings, carousel, latest] = await Promise.all([
    getHero(),
    getSiteSettings(),
    getCarousel(),
    getArticles(1, 6),
  ]);

  return (
    <>
      <Hero hero={hero} settings={settings} />

      {/* Value props */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-content gap-6 px-5 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-100 p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 h-12 w-12 rounded-xl bg-brand-primary/10" />
              <h3 className="text-lg font-bold text-brand-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Carousel images={carousel} />

      {/* SEO intro copy */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-3xl font-extrabold text-brand-ink">
            Nigeria&apos;s Leading Aluminium Roofing Sheet Supplier
          </h2>
          <p className="mt-4 text-gray-600">
            Based in Lagos, {settings.business_name} supplies and installs premium aluminium roofing
            sheets for homes, offices and industrial buildings across Nigeria. From long-span and
            step-tile to stone-coated profiles, we deliver durable, rust-resistant roofing at
            competitive prices — backed by expert advice and reliable service.
          </p>
        </div>
      </section>

      {/* Latest articles */}
      {latest.items.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-content px-5">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-ink">Latest Articles</h2>
                <p className="mt-1 text-gray-500">The 6 newest roofing tips, guides and product insights.</p>
              </div>
              <Link href="/articles" className="text-sm font-semibold text-brand-primary">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-brand-primary py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h2 className="text-3xl font-extrabold">Ready to roof with the best?</h2>
          <p className="mt-3 text-white/90">
            Get a free quote on premium aluminium roofing sheets today.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-brand-primary transition-transform hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
