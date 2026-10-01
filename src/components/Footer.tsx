import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';
import { formatAddress, formatBusinessName } from '@/lib/format';

export default function Footer({ settings }: { settings?: Partial<SiteSettings> | null }) {
  const s = settings || {};
  const businessName = (s.business_name || 'Nasuru Interiors').trim();
  const { first: firstPart, second: secondPart } = formatBusinessName(businessName);
  const displayAddress = formatAddress(s);

  // Social links filtering with safe type guard
  const socials = [
    { label: 'Facebook', url: s.facebook_url },
    { label: 'Instagram', url: s.instagram_url },
    { label: 'Twitter', url: s.twitter_url },
    { label: 'LinkedIn', url: s.linkedin_url },
    { label: 'TikTok', url: s.tiktok_url },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url && item.url.trim()));

  // Copyright text calculation with dynamic placeholders
  const year = String(new Date().getFullYear());
  const rawCopyright =
    s.copyright_text && s.copyright_text.trim()
      ? s.copyright_text
      : `© {year} {business_name}. Interior decor supplies for beautiful homes and spaces.`;

  const copyrightText = rawCopyright
    .replace(/{business_name}/gi, businessName)
    .replace(/{year}/gi, year);

  return (
    <footer className="bg-brand-deep text-white">
      {/* Gold hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <div className="mx-auto grid max-w-content gap-10 px-5 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl font-semibold">
            {firstPart}
            {secondPart && <span className="text-brand-gold"> {secondPart}</span>}
          </h3>
          {s.tagline && <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">{s.tagline}</p>}
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider2 text-brand-gold">Explore</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
            <li><Link href="/articles" className="transition-colors hover:text-white">Articles</Link></li>
            <li><Link href="/about" className="transition-colors hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider2 text-brand-gold">Contact</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            {displayAddress && <li>{displayAddress}</li>}
            {s.phone && (
              <li><a href={`tel:${s.phone}`} className="transition-colors hover:text-white">{s.phone}</a></li>
            )}
            {s.email && (
              <li><a href={`mailto:${s.email}`} className="transition-colors hover:text-white">{s.email}</a></li>
            )}
            {s.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${s.whatsapp.replace(/\D/g, '')}`}
                  className="transition-colors hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/75 transition-colors hover:text-brand-gold"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        {copyrightText}
      </div>
    </footer>
  );
}
