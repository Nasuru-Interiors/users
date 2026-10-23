import { Star } from 'lucide-react';
import { GOOGLE_PROFILE } from '@/lib/google';

/**
 * "★★★★★ 5.0 from 5 Google reviews", read from the Google Business Profile details in
 * lib/google.ts. Stars are SVG (decorative), the text carries the meaning. Only one
 * instance per page should be a link, so the anchor text isn't repeated.
 */
export default function GoogleRating({
  tone = 'light',
  link = false,
  className = '',
}: {
  tone?: 'light' | 'dark';
  link?: boolean;
  className?: string;
}) {
  const { rating, reviewCount, reviewsUrl } = GOOGLE_PROFILE;
  const full = Math.round(rating);
  const text = `${rating.toFixed(1)} from ${reviewCount} Google review${reviewCount === 1 ? '' : 's'}`;
  const textClass = tone === 'dark' ? 'text-white/90' : 'text-brand-ink';
  const starClass = tone === 'dark' ? 'text-brand-gold' : 'text-[#B8860B]';

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${textClass} ${className}`}>
      <span className={`flex ${starClass}`} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={16} fill={i < full ? 'currentColor' : 'none'} strokeWidth={1.5} />
        ))}
      </span>
      {link ? (
        <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline-offset-4 hover:underline">
          {text}
        </a>
      ) : (
        <span className="font-semibold">{text}</span>
      )}
    </div>
  );
}
