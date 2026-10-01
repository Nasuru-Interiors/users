import type { Article, SiteSettings } from './types';

const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? 'https://interiors.nasuru.com' : 'http://localhost:3000';

/** Canonical origin (no trailing slash) used for canonicals, sitemap and structured data. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

/** HomeGoodsStore / LocalBusiness schema, the core of local SEO for an interior deco supplier. */
export function localBusinessJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    name: s.business_name,
    description: s.default_meta_description,
    url: SITE_URL,
    ...(s.logo_url ? { logo: s.logo_url, image: s.logo_url } : {}),
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.email ? { email: s.email } : {}),
    ...(s.address || s.city || s.state
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(s.address ? { streetAddress: s.address } : {}),
            ...(s.city ? { addressLocality: s.city } : {}),
            ...(s.state ? { addressRegion: s.state } : {}),
            addressCountry: s.country || 'Nigeria',
          },
        }
      : {}),
    ...(s.lat && s.lng
      ? { geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } }
      : {}),
    areaServed: [
      ...(s.city ? [{ '@type': 'City', name: s.city }] : []),
      { '@type': 'Country', name: s.country || 'Nigeria' },
    ],
    knowsAbout: [
      'Interior decor',
      'Curtains and blinds',
      'Wallpapers',
      'Wall panels',
      'Flooring',
      'Lighting',
      'Upholstery fabrics',
    ],
    sameAs: [s.facebook_url, s.instagram_url, s.twitter_url, s.linkedin_url, s.tiktok_url].filter(
      Boolean,
    ),
  };
}

/** WebSite schema, helps Google show the correct site name in results. */
export function websiteJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: s.business_name,
    url: SITE_URL,
    inLanguage: 'en',
  };
}

export function organizationJsonLd(s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: s.business_name,
    url: SITE_URL,
    ...(s.logo_url ? { logo: s.logo_url } : {}),
    sameAs: [s.facebook_url, s.instagram_url, s.twitter_url, s.linkedin_url, s.tiktok_url].filter(
      Boolean,
    ),
  };
}

export function articleJsonLd(article: Article, s: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    ...(article.cover_image_url ? { image: article.cover_image_url } : {}),
    author: { '@type': 'Organization', name: article.author || s.business_name },
    publisher: {
      '@type': 'Organization',
      name: s.business_name,
      ...(s.logo_url ? { logo: { '@type': 'ImageObject', url: s.logo_url } } : {}),
    },
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
    keywords: (article.keywords || []).join(', '),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.url}`,
    })),
  };
}
