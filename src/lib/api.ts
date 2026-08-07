import type {
  AboutContent,
  Article,
  ArticleSummary,
  CarouselImage,
  Category,
  HeroSettings,
  Paginated,
  SiteSettings,
} from './types';

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Revalidate public content every 60s (ISR). Admin edits show up within a minute.
const REVALIDATE = 60;

async function get<T>(path: string, fallback: T, revalidate = REVALIDATE): Promise<T> {
  try {
    const res = await fetch(`${BASE}/api/public${path}`, { next: { revalidate } });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    // Network/backend down — degrade gracefully so the site still renders.
    return fallback;
  }
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  business_name: 'First Choice Roofing Services',
  tagline: "Nigeria's #1 Aluminium Roofing Sheet Supplier",
  logo_url: null,
  primary_color: '#7B1E2B',
  secondary_color: '#FFFFFF',
  default_hero_color: '#7B1E2B',
  phone: '',
  whatsapp: '',
  whatsapp_greeting:
    'Welcome to First Choice Roofing Services. How can we help you with your aluminium roofing today?',
  email: '',
  address: 'Lagos, Nigeria',
  city: 'Lagos',
  state: 'Lagos',
  country: 'Nigeria',
  lat: null,
  lng: null,
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  linkedin_url: '',
  tiktok_url: '',
  default_meta_title:
    'First Choice Roofing Services — Aluminium Roofing Sheets in Lagos, Nigeria',
  default_meta_description:
    "First Choice Roofing Services is Lagos, Nigeria's leading supplier of premium aluminium roofing sheets.",
  copyright_text: '',
};

const DEFAULT_HERO: HeroSettings = {
  heading: 'Premium Aluminium Roofing Sheets in Lagos',
  subheading:
    'Durable, weather-proof and affordable roofing solutions — supplied and installed across Nigeria.',
  cta_label: 'Get a Free Quote',
  cta_href: '/about',
  secondary_cta_label: 'Read Our Blog',
  secondary_cta_href: '/articles',
  background_type: 'color',
  background_color: '#7B1E2B',
  text_color: '#FFFFFF',
  overlay_opacity: 0.45,
  image_url: null,
};

export const getSiteSettings = () =>
  get<SiteSettings>('/site-settings', DEFAULT_SITE_SETTINGS);

export const getHero = () => get<HeroSettings>('/hero', DEFAULT_HERO);

export const getCarousel = () => get<CarouselImage[]>('/carousel', []);

export const getAbout = () =>
  get<AboutContent>('/about', {
    headline: 'About {business_name}',
    subheading:
      "Lagos, Nigeria's Premier Supplier & Installer of Premium Long-Span, Stone-Coated, and Custom Aluminium Roofing Sheets",
    body_html:
      '<p>Welcome to <strong>{business_name}</strong>, your premier partner for high-grade aluminium roofing solutions in Lagos and across Nigeria. Built on uncompromised structural integrity and modern architectural aesthetics, <strong>{business_name}</strong> supplies and installs top-quality aluminium roofing sheets engineered for tropical weather resilience.</p><h3>Our Core Products &amp; Capabilities</h3><p>At <strong>{business_name}</strong>, we provide a complete spectrum of roofing sheet designs tailored for residential homes, commercial complexes, and industrial developments:</p><ul><li><strong>Long-Span Aluminium Sheets:</strong> Precision-milled, rust-proof, and lightweight sheets ideal for modern homes and commercial buildings.</li><li><strong>Step-Tiles &amp; Metcoppo Profiles:</strong> Architecturally sophisticated roofing sheets that blend classic tile aesthetics with heavy-duty aluminium durability.</li><li><strong>Stone-Coated Roof Tiles:</strong> Premium stone-chip coated roofing tiles offering superior acoustic insulation and heat resistance.</li><li><strong>Custom Accessories &amp; Flashing:</strong> Matching gutters, ridge caps, fascia boards, and specialized flashing components engineered for zero-leakage protection.</li></ul><h3>Why Work With {business_name}?</h3><p>Selecting the right roof is a vital structural investment. Here is why property developers, site engineers, and homeowners across Lagos rely on <strong>{business_name}</strong>:</p><ul><li><strong>Certified Gauge Integrity:</strong> We guarantee true gauge thickness (0.45mm, 0.55mm, 0.70mm+) without compromises, ensuring maximum wind and corrosion resistance.</li><li><strong>Factory-Direct Rates:</strong> Direct partnerships with top aluminium coil manufacturers allow <strong>{business_name}</strong> to offer factory-direct pricing with no middleman markup.</li><li><strong>Turnkey Professional Installation:</strong> Certified roofing installers ensure precise structural alignment, watertight sealing, and long-lasting durability.</li><li><strong>Nationwide Logistics:</strong> Headquartered in Lagos, <strong>{business_name}</strong> delivers materials directly to project sites throughout Nigeria.</li></ul><h3>Our Quality Commitment</h3><p>Whether you are building your personal residence, renovating a commercial property, or managing a large housing development, <strong>{business_name}</strong> is committed to delivering roofing solutions that combine strength, beauty, and lasting value.</p>',
    image_url: null,
    stats: [
      { label: 'Industry Experience', value: '15+ Years' },
      { label: 'Projects Delivered', value: '2,500+' },
      { label: 'Leak-Free Guarantee', value: '100%' },
      { label: 'States Covered', value: '36' },
    ],
    team: [],
  });

export const getCategories = () => get<Category[]>('/categories', []);

export const getArticles = (page = 1, limit = 9, featured = false, category?: string) =>
  get<Paginated<ArticleSummary>>(
    `/articles?page=${page}&limit=${limit}${featured ? '&featured=true' : ''}${
      category ? `&category=${encodeURIComponent(category)}` : ''
    }`,
    { items: [], page, limit, total: 0, totalPages: 0 },
  );

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${BASE}/api/public/articles/${slug}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as Article;
  } catch {
    return null;
  }
}

export const getRelated = (slug: string) =>
  get<ArticleSummary[]>(`/articles/${slug}/related`, []);

export const getSitemapArticles = () =>
  get<{ slug: string; updated_at: string; published_at: string | null }[]>(
    '/sitemap-articles',
    [],
    300,
  );
