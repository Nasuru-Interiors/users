import type { SiteSettings } from '@/lib/types';
import { formatAddress } from '@/lib/format';
import { GOOGLE_PROFILE, OPENING_HOURS } from '@/lib/google';
import GoogleRating from '@/components/GoogleRating';

/**
 * Showroom address, hours, contact links and an embedded Google map pinned to the
 * Google Business Profile: the local signals (NAP + map) search engines look for on a
 * store's homepage. The iframe is lazy so it costs nothing until the visitor scrolls near it.
 */
export default function Showroom({ settings }: { settings: SiteSettings }) {
  const address = formatAddress(settings);
  if (!address) return null;

  const query = encodeURIComponent(GOOGLE_PROFILE.mapsQuery);
  const ll = `${GOOGLE_PROFILE.lat},${GOOGLE_PROFILE.lng}`;
  const whatsapp = settings.whatsapp?.replace(/\D/g, '');
  const area = [settings.city, settings.state].filter(Boolean).join(', ');

  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-content items-center gap-10 px-5 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Visit Us</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
            Our Showroom in {area || 'Lagos'}
          </h2>
          <GoogleRating className="mt-3" />
          <p className="mt-4 leading-relaxed text-brand-muted">
            Wall panels, marble sheets and stone finishes look different under real light, so come and
            see them before you buy. At our showroom you can compare UV marble sheet patterns side by
            side, feel the texture of PU stone and fluted panels, and match curtain and wallpaper
            colours to your paint or furniture samples.
          </p>
          <p className="mt-4 leading-relaxed text-brand-muted">
            Bring your wall measurements or a few photos of the room and our team will count the
            panels you need, price the job and book delivery to your home or site. We supply and
            install, so one visit covers materials, fixing and finishing.
          </p>
          <dl className="mt-6 space-y-3 text-brand-ink">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider2 text-brand-muted">Address</dt>
              <dd className="mt-1">{address}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-wider2 text-brand-muted">Opening hours</dt>
              <dd className="mt-1">{OPENING_HOURS.label}</dd>
            </div>
            {settings.phone && (
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider2 text-brand-muted">Phone</dt>
                <dd className="mt-1">
                  <a href={`tel:${settings.phone}`} className="font-semibold text-brand-primary hover:underline">
                    Call the showroom on {settings.phone}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={GOOGLE_PROFILE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Get directions on Google Maps
            </a>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Send us your wall size on WhatsApp
              </a>
            )}
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden border border-brand-ink/8 bg-brand-bg shadow-card">
          <iframe
            title={`Map showing ${settings.business_name} at ${address}`}
            src={`https://www.google.com/maps?q=${query}&ll=${ll}&z=17&output=embed`}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
