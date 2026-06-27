import Link from 'next/link';
import Image from 'next/image';
import type { ArticleSummary } from '@/lib/types';

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/articles/${article.slug}`}>
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          {article.cover_image_url ? (
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-brand-primary/10 text-brand-primary">
              <span className="text-sm font-semibold">First Choice Roofing</span>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
            <span>{formatDate(article.published_at)}</span>
            <span>•</span>
            <span>{article.reading_minutes} min read</span>
          </div>
          <h3 className="text-lg font-bold leading-snug text-brand-ink group-hover:text-brand-primary">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm text-gray-500">{article.excerpt}</p>
          )}
          <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">
            Read more →
          </span>
        </div>
      </Link>
    </article>
  );
}
