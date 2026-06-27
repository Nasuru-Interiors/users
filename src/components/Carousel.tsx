'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { CarouselImage } from '@/lib/types';

export default function Carousel({ images }: { images: CarouselImage[] }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (images.length <= 1) return;

    // Respect users who prefer reduced motion — don't auto-advance.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Pause the timer when the tab is hidden to save CPU (helps INP overall).
    const onVisibility = () => {
      paused.current = document.visibilityState === 'hidden';
    };
    document.addEventListener('visibilitychange', onVisibility);

    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(t);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [images.length]);

  if (!images.length) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-content px-5">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-brand-ink">Our Work & Products</h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-gray-500">
          Premium aluminium roofing sheets delivered and installed across Lagos and Nigeria.
        </p>

        <div className="relative overflow-hidden rounded-2xl shadow-xl">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <div key={img.id} className="relative h-[340px] min-w-full sm:h-[460px]">
                <Image
                  src={img.image_url}
                  alt={img.alt || 'First Choice Roofing aluminium roofing sheets'}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                    <p className="text-base font-semibold text-white">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? 'w-7 bg-brand-primary' : 'w-2.5 bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
