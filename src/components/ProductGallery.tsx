'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ProductGalleryImage } from '@/lib/products';

type GalleryFilter = 'all' | ProductGalleryImage['category'];

const FILTER_LABELS: Record<GalleryFilter, string> = {
  all: 'All photos',
  product: 'Product',
  installation: 'Installations',
  customer: 'Customer photos',
};

export default function ProductGallery({ images, productName }: {
  images: ProductGalleryImage[];
  productName: string;
}) {
  const [filter, setFilter] = useState<GalleryFilter>('all');
  const [selected, setSelected] = useState<ProductGalleryImage | null>(null);
  const availableFilters = (Object.keys(FILTER_LABELS) as GalleryFilter[]).filter(
    (category) => category === 'all' || images.some((image) => image.category === category),
  );
  const visibleImages = filter === 'all'
    ? images
    : images.filter((image) => image.category === filter);
  const activeImage = selected && visibleImages.includes(selected)
    ? selected
    : visibleImages[0] ?? null;

  return (
    <section aria-label={`${productName} image gallery`} className="space-y-4">
      {images.length > 0 ? (
        <>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-bg shadow-soft">
            {activeImage && (
              <Image
                src={activeImage.url}
                alt={activeImage.alt || `${productName} ${FILTER_LABELS[activeImage.category].toLowerCase()}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            )}
            {activeImage?.caption && (
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-12 text-sm text-white">
                {activeImage.caption}
              </p>
            )}
          </div>
          {availableFilters.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter product photos">
              {availableFilters.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={filter === category}
                  onClick={() => {
                    setFilter(category);
                    setSelected(null);
                  }}
                  className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${
                    filter === category
                      ? 'border-brand-ink bg-brand-ink text-white'
                      : 'border-brand-ink/10 bg-white text-brand-muted hover:border-brand-primary/40'
                  }`}
                >
                  {FILTER_LABELS[category]}
                </button>
              ))}
            </div>
          )}
          {visibleImages.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
              {visibleImages.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  aria-label={`Show photo ${index + 1}: ${image.alt || productName}`}
                  aria-pressed={activeImage === image}
                  onClick={() => setSelected(image)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    activeImage === image ? 'border-brand-primary' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-bg to-white px-8 text-center">
          <p className="max-w-xs text-sm leading-relaxed text-brand-muted">
            Product photos are being prepared. Contact our team for current finishes and availability.
          </p>
        </div>
      )}
    </section>
  );
}
