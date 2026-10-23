import { getArticles } from './api';
import type { ArticleSummary } from './types';

/** All published articles (the public API caps a page at 50, so walk every page). */
async function getAllArticles(): Promise<ArticleSummary[]> {
  const first = await getArticles(1, 50);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, first.totalPages - 1) }, (_, i) => getArticles(i + 2, 50)),
  );
  return [first, ...rest].flatMap((p) => p.items);
}

const normalise = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9₦\s]/g, ' ');

// Words that match almost everything and would drown out the useful terms.
const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'in', 'for', 'to', 'how', 'what', 'is', 'my', 'nigeria', 'lagos']);

/**
 * Simple ranked search over article titles, keywords and excerpts. Each query word scores
 * 3 in the title, 2 in a keyword and 1 in the excerpt; an exact phrase match in the title
 * adds a bonus. Articles must match at least one meaningful word.
 */
export async function searchArticles(query: string, limit = 24): Promise<ArticleSummary[]> {
  const q = normalise(query).trim();
  if (!q) return [];
  const words = q.split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w));
  const terms = words.length ? words : q.split(/\s+/);

  const articles = await getAllArticles();
  return articles
    .map((a) => {
      const title = normalise(a.title);
      const keywords = normalise((a.keywords || []).join(' '));
      const excerpt = normalise(a.excerpt || '');
      let score = title.includes(q) ? 6 : 0;
      for (const w of terms) {
        if (title.includes(w)) score += 3;
        if (keywords.includes(w)) score += 2;
        if (excerpt.includes(w)) score += 1;
      }
      return { a, score };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((r) => r.a);
}
