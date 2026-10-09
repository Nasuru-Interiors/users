import Link from 'next/link';
import { ShieldCheck, Truck, Award, PhoneCall, LayoutGrid, Sparkles } from 'lucide-react';
import { getArticles, getCarousel, getHero, getSiteSettings } from '@/lib/api';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ArticleCard from '@/components/ArticleCard';
import Reveal from '@/components/Reveal';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { faqJsonLd } from '@/lib/seo';
import { FAQS } from '@/lib/faq';

export const revalidate = 60;

const STATS = [
  { value: '5+', label: 'Product categories' },
  { value: '100%', label: 'Quality checked' },
  { value: 'Trade', label: 'Pricing for pros' },
  { value: 'Free', label: 'Quotes' },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Quality Materials', text: 'Curtains, wallpapers, wall panels and flooring selected for finish and durability.' },
  { icon: Truck, title: 'Supply & Delivery', text: 'Reliable supply for single rooms and full project fit-outs.' },
  { icon: Award, title: 'Trusted by Designers', text: 'The go-to deco supplier for homeowners, interior designers and contractors.' },
];

const CATEGORIES = [
  { title: 'Wall Panels', text: 'WPC, PVC and fluted panels for feature walls, TV backdrops and lobbies.' },
  { title: 'Acoustic Panels', text: 'Sound-softening panels that reduce echo in offices, studios and homes.' },
  { title: 'Flooring', text: 'SPC, WPC and vinyl flooring in wood, stone and concrete looks.' },
  { title: 'Outdoor Decor', text: 'Decking, fence panels and cladding built for patios, balconies and gardens.' },
  { title: 'Stone & Tiles', text: 'Lightweight flexible stone and ceramic-look cladding for walls and columns.' },
  { title: 'Curtains & Wallpaper', text: 'Curtains, blinds, upholstery fabrics and wallpapers to finish the room.' },
];

const STEPS = [
  { icon: PhoneCall, title: 'Get a Free Quote', text: "Tell us your room size and style, we'll price it, no obligation." },
  { icon: LayoutGrid, title: 'Choose Your Style', text: 'Pick from curtains, wallpapers, panels, flooring and decor in your colours.' },
  { icon: Truck, title: 'Fast Delivery', text: 'Delivered to your home or project site.' },
  { icon: Sparkles, title: 'Expert Advice', text: 'Our team helps you match colours, textures and quantities.' },
];

// Keyword anchors for the 2026 price guides. Labels deliberately differ from the article titles
// shown in the "Latest Articles" cards so no anchor text repeats on the page.
const PRICE_GUIDES = [
  { label: 'marble sticker prices', slug: 'price-of-marble-stickers-in-nigeria-lagos-2026' },
  { label: 'self-adhesive marble sticker rolls', slug: 'price-of-self-adhesive-marble-stickers-in-nigeria-lagos-2026' },
  { label: 'UV marble sheet prices', slug: 'price-of-marble-sheets-in-nigeria-lagos-2026' },
  { label: 'acrylic marble board prices', slug: 'price-of-acrylic-marble-board-in-nigeria-lagos-2026' },
  { label: 'fluted wall panel prices', slug: 'price-of-fluted-wall-panels-in-nigeria-lagos-2026' },
  { label: 'PU stone panel prices', slug: 'price-of-pu-stone-wall-panels-in-nigeria-lagos-2026' },
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
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero hero={hero} settings={settings} />

      {/* Stats band */}
      <section className="bg-brand-ink">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-y-8 px-5 py-10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={s.label} className={`text-center ${i ? 'md:border-l md:border-white/10' : ''}`}>
              <div className="font-serif text-3xl font-semibold text-brand-gold sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-white/70">{s.label}</div>
            </div>
          ))}
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
                <p className="mt-2 text-brand-muted">The 6 newest decor ideas, buying guides and styling tips.</p>
              </div>
              <Link href="/articles" className="btn-ghost">
                View all articles
              </Link>
            </div>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {latest.items.map((a, i) => (
                <Reveal key={a.id} delay={(i % 3) * 90}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product categories */}
      <section className="bg-brand-bg py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">What We Supply</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              Everything for a Finished Interior
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 90}>
                <div className="h-full border border-brand-ink/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <h3 className="font-serif text-xl font-semibold text-brand-ink">{c.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 90}>
                  <div className="group h-full rounded-2xl border border-brand-ink/8 bg-brand-bg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-gold group-hover:text-brand-ink">
                      <Icon size={26} />
                    </div>
                    <p className="font-serif text-xl font-semibold text-brand-ink">{f.title}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-brand-muted">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Carousel images={carousel} />

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">How It Works</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              From quote to finished room
            </h2>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="relative h-full rounded-2xl border border-brand-ink/8 bg-brand-bg p-7">
                    <span className="absolute right-5 top-4 font-serif text-4xl font-semibold text-brand-primary/10">
                      {i + 1}
                    </span>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary text-white">
                      <Icon size={22} />
                    </div>
                    <p className="font-serif text-lg font-semibold text-brand-ink">{s.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-brand-muted">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO intro copy */}
      <section className="bg-brand-bg py-24">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <span className="eyebrow justify-center">Why Nasuru Interiors</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
            Your Interior Deco Supply Partner
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            {settings.business_name} supplies quality curtains, wallpapers, wall panels, flooring,
            lighting and decor accessories for homes, offices, hotels and showrooms. From a single
            room refresh to a full fit-out, we deliver beautiful, durable interior finishes at
            competitive prices, backed by expert advice and reliable service.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            We stock the finishes Lagos homeowners, interior designers and contractors ask for most:
            PVC and UV marble sheets, acrylic marble boards, marble stickers and self-adhesive marble
            wallpaper, WPC fluted wall panels, PU stone panels, acoustic panels, SPC and vinyl
            flooring, curtains, blinds and wallpapers. Visit our {settings.city || 'Mushin'},{' '}
            {settings.state || 'Lagos'} store to see colours and textures in person, or send us your
            wall size for a quick quantity count and delivery quote.
          </p>
          <p className="mt-5 text-lg leading-relaxed text-brand-muted">
            Planning a budget? Our 2026 price guides list current Lagos prices and show how much you
            need for a typical wall:{' '}
            {PRICE_GUIDES.map((g, i) => (
              <span key={g.slug}>
                <Link href={`/articles/${g.slug}`} className="font-semibold text-brand-primary hover:underline">
                  {g.label}
                </Link>
                {i < PRICE_GUIDES.length - 2 ? ', ' : i === PRICE_GUIDES.length - 2 ? ' and ' : '.'}
              </span>
            ))}
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-brand-gold" />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-content px-5">
          <Reveal className="mb-12 text-center">
            <span className="eyebrow justify-center">Questions</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <Reveal>
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-deep py-20 text-center text-white">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(80% 120% at 50% 0%, rgba(201,162,39,0.18) 0%, rgba(201,162,39,0) 55%)' }}
        />
        <Reveal className="relative mx-auto max-w-2xl px-5">
          <span className="eyebrow justify-center">Get Started</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">Ready to transform your space?</h2>
          <p className="mt-3 text-white/80">Get a free quote on premium interior decor supplies today.</p>
          <Link href="/about" className="btn-gold mt-8 px-9 py-3.5">
            Contact Us
          </Link>
        </Reveal>
      </section>
    </>
  );
}
