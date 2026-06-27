import type { Metadata } from 'next';
import { getAbout, getSiteSettings } from '@/lib/api';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: 'About Us',
    description: `Learn about ${s.business_name} — Lagos, Nigeria's trusted supplier of premium aluminium roofing sheets.`,
    alternates: { canonical: '/about' },
    openGraph: { title: `About ${s.business_name}`, url: '/about' },
  };
}

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSiteSettings()]);

  return (
    <div className="bg-white">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about' }])} />

      <section className="bg-brand-primary pb-16 pt-32 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="text-4xl font-extrabold sm:text-5xl">{about.headline}</h1>
          {about.subheading && <p className="mt-3 text-white/90">{about.subheading}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: about.body_html }}
          />
          {about.image_url ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={about.image_url}
                alt={settings.business_name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
              <span className="font-semibold">{settings.business_name}</span>
            </div>
          )}
        </div>

        {about.stats.length > 0 && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-gray-50 p-6 text-center">
                <div className="text-3xl font-extrabold text-brand-primary">{s.value}</div>
                <div className="mt-1 text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact band */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-content px-5">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-brand-ink">Get in Touch</h2>
          <div className="grid gap-6 text-center sm:grid-cols-3">
            {settings.phone && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-brand-primary">Call Us</h3>
                <a href={`tel:${settings.phone}`} className="mt-2 block text-gray-600">
                  {settings.phone}
                </a>
              </div>
            )}
            {settings.email && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-bold text-brand-primary">Email</h3>
                <a href={`mailto:${settings.email}`} className="mt-2 block text-gray-600">
                  {settings.email}
                </a>
              </div>
            )}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-bold text-brand-primary">Visit</h3>
              <p className="mt-2 text-gray-600">{settings.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
