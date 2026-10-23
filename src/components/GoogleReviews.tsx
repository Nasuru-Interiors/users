import { Star } from 'lucide-react';
import { GOOGLE_PROFILE, GOOGLE_REVIEWS } from '@/lib/google';
import GoogleRating from '@/components/GoogleRating';

/** Real Google reviews from the Business Profile, with links to read all and leave a review. */
export default function GoogleReviews() {
  if (!GOOGLE_REVIEWS.length) return null;

  return (
    <section className="bg-brand-deep py-20">
      <div className="mx-auto max-w-content px-5">
        <div className="mb-10 text-center">
          <span className="eyebrow justify-center">Customer Reviews</span>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
            What Our Customers Say on Google
          </h2>
          <GoogleRating tone="dark" className="mt-4 justify-center" />
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {GOOGLE_REVIEWS.map((r) => (
            <li key={r.author} className="flex h-full flex-col border border-brand-ink/8 bg-white p-7 shadow-soft">
              <span className="flex text-[#B8860B]" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={1.5} />
                ))}
              </span>
              <blockquote className="mt-4 flex-1 leading-relaxed text-brand-ink">&ldquo;{r.text}&rdquo;</blockquote>
              <p className="mt-5 text-sm font-semibold text-brand-ink">{r.author}</p>
              <p className="text-xs text-brand-muted">Google review, {r.when}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={GOOGLE_PROFILE.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
            Read all {GOOGLE_PROFILE.reviewCount} reviews on Google
          </a>
          <a href={GOOGLE_PROFILE.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
            Bought from us? Leave a review
          </a>
        </div>
      </div>
    </section>
  );
}
