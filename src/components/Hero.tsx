import Link from 'next/link';
import Image from 'next/image';
import type { HeroSettings, SiteSettings } from '@/lib/types';

/**
 * Admin-designed hero. When background_type is "image" and an image exists, it
 * renders the Cloudinary image with an overlay. Otherwise it falls back to a
 * solid color (admin-set background_color / default_hero_color).
 */
export default function Hero({ hero, settings }: { hero: HeroSettings; settings: SiteSettings }) {
  const useImage = hero.background_type === 'image' && !!hero.image_url;
  const fallbackColor = hero.background_color || settings.default_hero_color || '#E10600';

  return (
    <section
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden"
      style={!useImage ? { backgroundColor: fallbackColor } : undefined}
    >
      {useImage && (
        <>
          <Image
            src={hero.image_url as string}
            alt={hero.heading}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: '#000', opacity: hero.overlay_opacity }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-5 text-center animate-fade-in">
        <h1
          className="text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
          style={{ color: hero.text_color || '#FFFFFF' }}
        >
          {hero.heading}
        </h1>
        {hero.subheading && (
          <p
            className="mx-auto mt-5 max-w-2xl text-base sm:text-lg"
            style={{ color: hero.text_color || '#FFFFFF', opacity: 0.92 }}
          >
            {hero.subheading}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {hero.cta_label && (
            <Link
              href={hero.cta_href || '/about'}
              className="rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-primary shadow-lg transition-transform hover:scale-105"
            >
              {hero.cta_label}
            </Link>
          )}
          {hero.secondary_cta_label && (
            <Link
              href={hero.secondary_cta_href || '/articles'}
              className="rounded-full border-2 border-white px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-brand-primary"
            >
              {hero.secondary_cta_label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
