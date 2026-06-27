import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#E10600',
  width: 'device-width',
  initialScale: 1,
};
import { getSiteSettings } from '@/lib/api';
import { SITE_URL, localBusinessJsonLd, organizationJsonLd } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: s.default_meta_title,
      template: `%s | ${s.business_name}`,
    },
    description: s.default_meta_description,
    keywords: [
      'aluminium roofing sheets',
      'roofing sheets Lagos',
      'roofing sheets Nigeria',
      'aluminium roofing Nigeria',
      'long span aluminium',
      'stone coated roofing',
      s.business_name,
    ],
    applicationName: s.business_name,
    authors: [{ name: s.business_name }],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: s.business_name,
      title: s.default_meta_title,
      description: s.default_meta_description,
      url: SITE_URL,
      locale: 'en_NG',
    },
    twitter: {
      card: 'summary_large_image',
      title: s.default_meta_title,
      description: s.default_meta_description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  // Feed admin-chosen brand colors into CSS variables (red/white system).
  const themeVars = `:root{--brand-primary:${settings.primary_color};--brand-secondary:${settings.secondary_color};}`;

  return (
    <html lang="en">
      <head>
        {/* Warm up the Cloudinary connection early so the LCP image lands faster. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      </head>
      <body>
        <JsonLd data={localBusinessJsonLd(settings)} />
        <JsonLd data={organizationJsonLd(settings)} />
        <Header settings={settings} />
        <main>{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
