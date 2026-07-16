export interface SiteSettings {
  business_name: string;
  tagline: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  default_hero_color: string;
  phone: string;
  whatsapp: string;
  whatsapp_greeting: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lat: number | null;
  lng: number | null;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  linkedin_url: string;
  default_meta_title: string;
  default_meta_description: string;
}

export interface HeroSettings {
  heading: string;
  subheading: string;
  cta_label: string;
  cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  background_type: 'image' | 'color';
  background_color: string;
  text_color: string;
  overlay_opacity: number;
  image_url: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface CarouselImage {
  id: string;
  image_url: string;
  alt: string;
  caption: string;
  sort_order: number;
}

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  author: string;
  reading_minutes: number;
  published_at: string | null;
  featured?: boolean;
  keywords?: string[];
}

export interface Article extends ArticleSummary {
  content_html: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  updated_at: string;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AboutContent {
  headline: string;
  subheading: string;
  body_html: string;
  image_url: string | null;
  stats: { label: string; value: string }[];
  team: { name: string; role: string; image_url?: string }[];
}
