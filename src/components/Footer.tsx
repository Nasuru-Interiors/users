import Link from 'next/link';
import type { SiteSettings } from '@/lib/types';

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: 'Facebook', url: settings.facebook_url },
    { label: 'Instagram', url: settings.instagram_url },
    { label: 'Twitter', url: settings.twitter_url },
    { label: 'LinkedIn', url: settings.linkedin_url },
  ].filter((s) => s.url);

  return (
    <footer className="bg-brand-ink text-white">
      <div className="mx-auto grid max-w-content gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-extrabold text-brand-primary">{settings.business_name}</h3>
          <p className="mt-2 max-w-xs text-sm text-gray-300">{settings.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-200">Explore</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/articles" className="hover:text-white">Articles</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-200">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {settings.address && <li>{settings.address}</li>}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone}`} className="hover:text-white">{settings.phone}</a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a>
              </li>
            )}
            {settings.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            )}
          </ul>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3 text-sm">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-brand-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {settings.business_name}. Aluminium roofing sheets in Lagos, Nigeria.
      </div>
    </footer>
  );
}
