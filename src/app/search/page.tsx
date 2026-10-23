import type { Metadata } from 'next';
import Link from 'next/link';
import { searchArticles } from '@/lib/search';
import ArticleCard from '@/components/ArticleCard';
import SearchForm from '@/components/SearchForm';

// Results pages are thin and endless, so keep them out of the index but let crawlers follow links.
export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim().slice(0, 100);
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="bg-brand-bg">
      <section className="bg-brand-deep pb-14 pt-36 text-white">
        <div className="mx-auto max-w-3xl px-5">
          <span className="eyebrow">Search</span>
          <h1 className="mt-4 font-serif text-3xl font-semibold sm:text-4xl">
            {q ? <>Results for &ldquo;{q}&rdquo;</> : 'Search our prices and guides'}
          </h1>
          <SearchForm defaultValue={q} className="mt-6" id="search-page-input" />
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-14">
        {q && (
          <p className="mb-8 text-brand-muted" aria-live="polite">
            {results.length
              ? `${results.length} ${results.length === 1 ? 'article' : 'articles'} found.`
              : 'No articles matched your search.'}
          </p>
        )}

        {results.length > 0 ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-brand-ink/15 bg-white p-10 text-center">
            <p className="font-serif text-xl font-semibold text-brand-ink">
              {q ? 'Try a product name like marble sheet, fluted panel or PU stone.' : 'Type a product, price or question above.'}
            </p>
            <p className="mt-3 text-sm text-brand-muted">
              Or <Link href="/articles" className="font-semibold text-brand-primary hover:underline">browse every guide</Link>, or
              ask us directly on WhatsApp for a price.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
