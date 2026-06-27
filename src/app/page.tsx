import Link from 'next/link';
import { getArticles, getCarousel, getHero, getSiteSettings } from '@/lib/api';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 60;

const FEATURES = [
  {
    title: 'Premium Aluminium',
    text: 'Long-span, weather-proof aluminium roofing sheets engineered for the Nigerian climate.',
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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-brand-ink/8 bg-brand-bg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 font-serif text-lg font-semibold text-brand-primary transition-colors group-hover:bg-brand-gold group-hover:text-brand-ink">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-ink">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Carousel images={carousel} />

      {/* SEO intro copy */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <span className="eyebrow justify-center">Why First Choice</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            Nigeria&apos;s Leading Aluminium Roofing Sheet Supplier
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            Based in Lagos, {settings.business_name} supplies and installs premium aluminium roofing
            sheets for homes, offices and industrial buildings across Nigeria. From long-span and
            step-tile to stone-coated profiles, we deliver durable, rust-resistant roofing at
            competitive prices — backed by expert advice and reliable service.
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-brand-gold" />
        </div>
      </section>

      {/* Latest articles */}
      {latest.items.length > 0 && (
        <section className="bg-brand-bg py-20">
          <div className="mx-auto max-w-content px-5">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="eyebrow">From the Blog</span>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
                  Latest Articles
                </h2>
                <p className="mt-2 text-brand-muted">
                  The 6 newest roofing tips, guides and product insights.
                </p>
              </div>
              <Link href="/articles" className="btn-ghost">
                View all articles
              </Link>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {latest.items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-deep py-20 text-center text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(80% 120% at 50% 0%, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 55%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-5">
          <span className="eyebrow justify-center">Get Started</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
            Ready to roof with the best?
          </h2>
          <p className="mt-3 text-white/80">
            Get a free quote on premium aluminium roofing sheets today.
          </p>
          <Link href="/about" className="btn-gold mt-8 px-9 py-3.5">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
