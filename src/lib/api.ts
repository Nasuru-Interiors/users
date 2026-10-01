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
    // Network/backend down, degrade gracefully so the site still renders.
    return fallback;
  }
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  business_name: 'Nasuru Interiors',
  tagline: 'Interior Deco Supply: Curtains, Wallpapers, Wall Panels & Flooring',
  logo_url: null,
  primary_color: '#2F5D8C',
  secondary_color: '#FFFFFF',
  default_hero_color: '#2F5D8C',
  phone: '',
  whatsapp: '',
  whatsapp_greeting:
    'Welcome to Nasuru Interiors. How can we help with your interior decor today?',
  email: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  lat: null,
  lng: null,
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  linkedin_url: '',
  tiktok_url: '',
  default_meta_title:
    'Nasuru Interiors: Interior Deco Supply in Nigeria',
  default_meta_description:
    'Nasuru Interiors supplies curtains, wallpapers, wall panels, flooring, lighting and decor in Nigeria. Quality products, fair prices and free quotes.',
  copyright_text: '',
};

const DEFAULT_HERO: HeroSettings = {
  heading: 'Beautiful Interiors Start with the Right Supplies',
  subheading:
    'Curtains, wallpapers, wall panels, flooring, lighting and decor: everything you need to style your space.',
  cta_label: 'Get a Free Quote',
  cta_href: '/about',
  secondary_cta_label: 'Read Our Blog',
  secondary_cta_href: '/articles',
  background_type: 'color',
  background_color: '#2F5D8C',
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
      'Your Interior Deco Supply Partner for Curtains, Wallpapers, Wall Panels, Flooring, Lighting & Decor',
    body_html:
      '<p>Welcome to <strong>{business_name}</strong>, your one-stop interior deco supply store for homeowners, interior designers, contractors and property developers. We source and supply quality finishes and decor that turn ordinary rooms into beautiful, functional spaces.</p><h3>What We Supply</h3><p>From a single room refresh to a full fit-out, <strong>{business_name}</strong> stocks everything you need to bring your interior design vision to life:</p><ul><li><strong>Curtains, Blinds &amp; Upholstery Fabrics:</strong> Sheers, blackout curtains, roller and Roman blinds, plus premium fabrics for sofas, cushions and headboards.</li><li><strong>Wall Panels &amp; Wallpapers:</strong> WPC and PVC wall panels, fluted (ribbed) panels, acoustic panels, 3D and textured wallpapers for feature walls.</li><li><strong>Flexible Stone &amp; Tiles:</strong> lightweight flexible stone and ceramic-look cladding for walls, columns and fireplaces.</li><li><strong>Flooring &amp; Rugs:</strong> SPC, WPC and vinyl flooring, carpets and rugs that balance style with durability.</li><li><strong>Outdoor Decor:</strong> WPC decking, fence panels and cladding for patios, balconies and gardens.</li><li><strong>Ceilings &amp; Lighting:</strong> PVC and POP ceiling accessories, chandeliers, pendant lights, wall lights and LED strip lighting.</li><li><strong>Decor Accessories:</strong> Mirrors, vases, cushions, throws, artificial plants and finishing touches that complete a room.</li></ul><h3>Why Choose {business_name}?</h3><p>Great interiors start with the right materials. Here is why homeowners, designers and developers rely on <strong>{business_name}</strong>:</p><ul><li><strong>Curated Quality:</strong> Every product is selected for finish, durability and lasting good looks.</li><li><strong>Wide Range of Styles:</strong> Modern, classic, minimalist or luxury, we stock designs for every taste and budget.</li><li><strong>Fair, Transparent Pricing:</strong> Competitive rates with honest quotes and trade pricing for bulk and project orders.</li><li><strong>Helpful Advice:</strong> Not sure what suits your space? Our team helps you choose colours, textures and quantities.</li></ul><h3>Our Commitment</h3><p>Whether you are furnishing a new home, refreshing an apartment, or outfitting an office, hotel or showroom, <strong>{business_name}</strong> is committed to supplying interior products that combine beauty, quality and value.</p>',
    image_url: null,
    stats: [
      { label: 'Product Categories', value: '5+' },
      { label: 'Happy Clients', value: '1,000+' },
      { label: 'Quality Checked', value: '100%' },
      { label: 'Free Quotes', value: 'Always' },
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
