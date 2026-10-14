import { notFound, permanentRedirect } from 'next/navigation';
import { getArticle } from '@/lib/api';

// Visibly (and links built from its article URLs) point at /{slug} instead of /articles/{slug}.
// Redirect those to the real article; anything else at the root is a genuine 404.
// Static routes (/articles, /about, robots.txt, sitemap.xml, ...) take precedence over this one.

export const revalidate = 60;

async function resolve(slug: string): Promise<never> {
  const article = await getArticle(slug);
  if (article) permanentRedirect(`/articles/${article.slug}`);
  notFound();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Runs before streaming starts, so the redirect / 404 status is sent correctly.
  return resolve(params.slug);
}

export default async function LegacyArticleRedirect({ params }: { params: { slug: string } }) {
  return resolve(params.slug);
}
