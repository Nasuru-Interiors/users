'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/types';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'About Us', href: '/about' },
];

export default function Header({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // rAF-throttle the scroll handler so it never blocks the main thread (INP).
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {settings.logo_url ? (
            <div className="relative h-10 w-40">
              <Image
                src={settings.logo_url}
                alt={settings.business_name}
                fill
                sizes="160px"
                priority
                className="object-contain object-left"
              />
            </div>
          ) : (
            <span
              className={`text-lg font-extrabold leading-tight ${
                solid ? 'text-brand-primary' : 'text-white'
              }`}
            >
              First Choice
              <span className={solid ? 'text-brand-ink' : 'text-white'}> Roofing</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors hover:text-brand-primary ${
                solid ? 'text-brand-ink' : 'text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/about"
            className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Get a Quote
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <div className={`space-y-1.5 ${solid ? 'text-brand-ink' : 'text-white'}`}>
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
            <span className="block h-0.5 w-6 bg-current" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t bg-white px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2 py-2 text-sm font-semibold text-brand-ink hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
