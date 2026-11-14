import type { Metadata } from 'next';
import { getProducts, getSiteSettings } from '@/lib/api';
import ShopCatalog from '@/components/ShopCatalog';
import JsonLd from '@/components/JsonLd';
import { DEFAULT_OG_IMAGE, breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop Wall Panels, Marble Sheets & Interior Finishes',
  description:
    'Browse Nasuru Interiors wall panels, PVC/UV marble sheets, boards and sticker rolls. Compare product sizes, thicknesses and prices, then order by WhatsApp.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Wall Panels, Marble Sheets & Interior Finishes',
    description:
      'Explore wall panels, marble-look sheets and rolls with clear sizes and catalog prices. Chat with Nasuru Interiors to order.',
    url: '/shop',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function ShopPage() {
  const [settings, products] = await Promise.all([getSiteSettings(), getProducts()]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
        ])}
      />
      <ShopCatalog products={products} whatsapp={settings.whatsapp} />
    </>
  );
}
