import type { SiteSettings } from './types';

/**
 * Formats a full readable address from street address, city, state, and country
 * without duplicating city/state if already contained in the street address string.
 */
export function formatAddress(s?: Partial<SiteSettings> | null): string {
  if (!s) return '';
  const street = (s.address || '').trim();
  const city = (s.city || '').trim();
  const state = (s.state || '').trim();
  const country = (s.country || '').trim();

  if (!street && !city && !state && !country) return '';

  const parts: string[] = [];
  if (street) parts.push(street);
  if (city && !street.toLowerCase().includes(city.toLowerCase())) parts.push(city);
  if (
    state &&
    !street.toLowerCase().includes(state.toLowerCase()) &&
    !city.toLowerCase().includes(state.toLowerCase())
  ) {
    parts.push(state);
  }
  if (country && !street.toLowerCase().includes(country.toLowerCase())) {
    parts.push(country);
  }

  return parts.join(', ');
}

/**
 * Splits a business name into two styled parts for elegant typography headings.
 */
export function formatBusinessName(name?: string | null): { first: string; second: string } {
  const clean = (name || 'First Choice Roofing Services').trim();
  const words = clean.split(/\s+/);
  if (words.length <= 1) return { first: clean, second: '' };
  const splitIndex = words.length > 2 ? 2 : 1;
  return {
    first: words.slice(0, splitIndex).join(' '),
    second: words.slice(splitIndex).join(' '),
  };
}
