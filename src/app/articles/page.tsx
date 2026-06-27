import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getSiteSettings } from '@/lib/api';
import ArticleCard from '@/components/ArticleCard';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: 'Roofing Articles & Guides',
    description: `Expert articles on aluminium roofing sheets, installation tips and product guides from ${s.business_name}, Lagos, Nigeria.`,
    alternates: { canonical: '/articles' },
    openGraph: {
      title: `Roofing Articles & Guides | ${s.business_name}`,
      description: 'Expert articles on aluminium roofing sheets in Nigeria.',
      url: '/articles',
    },
  };
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const data = await getArticles(page, 9);

  return (
    <div className="bg-gray-50">
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Articles', url: '/articles' }])} />

      {/* Page header (red band; sits under the transparent header) */}
      <section className="bg-brand-primary pb-14 pt-32 text-center text-white">
        <div className="mx-auto max-w-2xl px-5">
          <h1 className="text-4xl font-extrabold sm:text-5xl">Roofing Articles & Guides</h1>
          <p className="mt-3 text-white/90">
            Insights on aluminium roofing sheets, installation and maintenance in Nigeria.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-content px-5 py-14">
        {data.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <p className="text-lg font-semibold text-brand-ink">No articles published yet</p>
            <p className="mt-2 text-sm text-gray-500">Check back soon for roofing tips and guides.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {page > 1 && (
                  <Link
                    href={`/articles?page=${page - 1}`}
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-brand-ink hover:border-brand-primary"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="text-sm text-gray-500">
                  Page {page} of {data.totalPages}
                </span>
                {page < data.totalPages && (
                  <Link
                    href={`/articles?page=${page + 1}`}
                    className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-brand-ink hover:border-brand-primary"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
