import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calculator, MessageCircle } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import ProductGallery from '@/components/ProductGallery';
import ProductVideos from '@/components/ProductVideos';
import { getProduct, getSiteSettings } from '@/lib/api';
import type { ProductGalleryImage } from '@/lib/products';
import {
  DEFAULT_OG_IMAGE,
  breadcrumbJsonLd,
  productJsonLd,
  SITE_URL,
} from '@/lib/seo';

export const revalidate = 60;

type ProductPageProps = { params: { id: string } };

function getGalleryImages(product: Awaited<ReturnType<typeof getProduct>>): ProductGalleryImage[] {
  if (!product) return [];
  if (product.galleryImages?.length) return product.galleryImages;
  return product.imageUrl
    ? [{
        url: product.imageUrl,
        alt: product.imageAlt || `${product.name}, ${product.size}`,
        category: 'product',
        caption: '',
      }]
    : [];
}

function productDescription(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>): string {
  return product.description?.trim() || `${product.name} in ${product.size}. Contact Nasuru Interiors for availability and delivery options.`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const description = productDescription(product);
  const images = getGalleryImages(product);
  const shareImage = images[0]?.url || DEFAULT_OG_IMAGE.url;

  return {
    title: product.name,
    description: description.slice(0, 300),
    alternates: { canonical: `/shop/${encodeURIComponent(product.id)}` },
    openGraph: {
      type: 'website',
      title: product.name,
      description: description.slice(0, 300),
      url: `/shop/${encodeURIComponent(product.id)}`,
      images: [{ url: shareImage, alt: images[0]?.alt || product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: description.slice(0, 300),
      images: [shareImage],
    },
    metadataBase: new URL(SITE_URL),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const [product, settings] = await Promise.all([getProduct(params.id), getSiteSettings()]);
  if (!product) notFound();

  const images = getGalleryImages(product);
  const digits = settings.whatsapp.replace(/\D/g, '');
  const orderMessage = [
    `Hello ${settings.business_name}, I would like to know more about:`,
    `${product.name} (${product.size})`,
    product.price === null
      ? 'Please confirm the current price.'
      : `Catalog price: ₦${Math.round(product.price).toLocaleString('en-NG')} per ${product.unitName}.`,
    'Please confirm availability and delivery options.',
  ].join('\n');
  const orderHref = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(orderMessage)}`
    : '/about';

  const specifications = [
    { name: 'Listed size', value: product.size },
    { name: 'Calculator dimensions', value: `${product.width} m × ${product.length} m` },
    { name: 'Calculator item type', value: product.kind === 'strip' ? 'Upright strip panel' : product.kind === 'roll' ? 'Roll' : 'Sheet or board' },
    ...(product.material ? [{ name: 'Material', value: product.material }] : []),
    ...(product.origin ? [{ name: 'Origin', value: product.origin }] : []),
    ...(product.thicknessMm != null ? [{ name: 'Thickness', value: `${product.thicknessMm} mm` }] : []),
    ...(product.specifications ?? []),
  ];

  return (
    <article className="bg-brand-bg">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Shop', url: '/shop' },
          { name: product.name, url: `/shop/${encodeURIComponent(product.id)}` },
        ])}
      />
      <JsonLd data={productJsonLd(product, settings.business_name)} />

      <header className="bg-white pb-8 pt-32 sm:pb-10">
        <div className="mx-auto max-w-content px-5">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline">
            <ArrowLeft size={16} aria-hidden="true" /> Back to shop
          </Link>
          <nav aria-label="Breadcrumb" className="mt-5 text-xs text-brand-muted">
            <Link href="/" className="hover:text-brand-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-brand-primary">Shop</Link>
            <span className="mx-2">/</span>
            <span aria-current="page" className="text-brand-ink">{product.name}</span>
          </nav>
        </div>
      </header>

      <section className="py-8 sm:py-12">
        <div className="mx-auto grid max-w-content gap-9 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <ProductGallery images={images} productName={product.name} />

          <div className="self-start lg:sticky lg:top-8">
            {product.featured && (
              <span className="inline-flex rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                Popular finish
              </span>
            )}
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-brand-ink sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-base text-brand-muted">{product.size}</p>
            <p className="mt-5 whitespace-pre-line text-sm leading-7 text-brand-muted">
              {productDescription(product)}
            </p>

            <div className="mt-6 rounded-2xl border border-brand-ink/8 bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Catalog price</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-brand-ink">
                {product.price === null
                  ? 'Ask for price'
                  : `₦${Math.round(product.price).toLocaleString('en-NG')}`}
              </p>
              {product.price !== null && <p className="mt-1 text-sm text-brand-muted">per {product.unitName}</p>}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a
                  href={orderHref}
                  target={digits ? '_blank' : undefined}
                  rel={digits ? 'noopener noreferrer' : undefined}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#20c765] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#16ad55] focus:outline-none focus:ring-2 focus:ring-[#20c765] focus:ring-offset-2"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {digits ? 'Chat to order' : 'Request details'}
                </a>
                <Link
                  href={`/calculator?p=${encodeURIComponent(product.id)}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-ink px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary"
                >
                  <Calculator size={17} aria-hidden="true" /> Calculate quantity
                </Link>
              </div>
              {product.guide && (
                <Link href={product.guide} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
                  Read the product guide <ArrowRight size={15} aria-hidden="true" />
                </Link>
              )}
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-2xl font-semibold text-brand-ink">Product specifications</h2>
              <dl className="mt-4 divide-y divide-brand-ink/8 rounded-xl border border-brand-ink/8 bg-white px-4">
                {specifications.map(({ name, value }, index) => (
                  <div key={`${name}-${index}`} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3 text-sm">
                    <dt className="text-brand-muted">{name}</dt>
                    <dd className="font-medium text-brand-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {images.some((image) => image.category === 'customer') && (
        <section className="border-t border-brand-ink/8 bg-white py-12">
          <div className="mx-auto max-w-content px-5">
            <div className="mb-5">
              <span className="eyebrow">Real spaces</span>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-ink">Customer photos</h2>
              <p className="mt-2 text-sm text-brand-muted">See how customers have used this finish in their spaces.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.filter((image) => image.category === 'customer').map((image, index) => (
                <figure key={`${image.url}-${index}`} className="overflow-hidden rounded-xl bg-brand-bg">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} in a customer space`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  {image.caption && <figcaption className="p-3 text-sm text-brand-muted">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductVideos videos={product.installationVideos ?? []} productName={product.name} />
    </article>
  );
}
