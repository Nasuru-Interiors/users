import { Play } from 'lucide-react';

function getEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;

    if (['youtu.be', 'www.youtube.com', 'youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      const pathParts = url.pathname.split('/').filter(Boolean);
      const id = url.hostname === 'youtu.be'
        ? pathParts[0]
        : url.searchParams.get('v') ?? (
          ['embed', 'shorts', 'live'].includes(pathParts[0]) ? pathParts[1] : undefined
        );
      return id && /^[\w-]{6,20}$/.test(id)
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null;
    }

    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
      const id = url.pathname.split('/').filter(Boolean).reverse().find((part) => /^\d+$/.test(part));
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export default function ProductVideos({ videos, productName }: {
  videos: string[];
  productName: string;
}) {
  const embeds = videos.map(getEmbedUrl).filter((url): url is string => url !== null);
  if (!embeds.length) return null;

  return (
    <section className="border-t border-brand-ink/8 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-content px-5">
        <span className="eyebrow">See it in action</span>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-brand-ink">Installation videos</h2>
        <div className="mt-7 grid gap-6 lg:grid-cols-2">
          {embeds.map((src, index) => (
            <div key={src} className="overflow-hidden rounded-2xl border border-brand-ink/8 bg-brand-bg shadow-soft">
              <div className="relative aspect-video">
                <iframe
                  src={src}
                  title={`${productName} installation video ${index + 1}`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
              <p className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand-ink">
                <Play size={15} aria-hidden="true" className="text-brand-primary" />
                {productName} · Installation guide {index + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
