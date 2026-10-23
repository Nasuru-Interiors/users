import { Search } from 'lucide-react';

/** Site-wide search box. A plain GET form to /search, so it works without JavaScript. */
export default function SearchForm({
  defaultValue = '',
  className = '',
  id = 'site-search',
}: {
  defaultValue?: string;
  className?: string;
  id?: string;
}) {
  return (
    <form action="/search" method="get" role="search" className={`flex w-full max-w-xl ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search prices, products and guides
      </label>
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search prices, products and guides…"
        autoComplete="off"
        enterKeyHint="search"
        className="min-w-0 flex-1 border border-white/30 bg-white px-4 py-3.5 text-sm text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center gap-2 bg-brand-gold px-5 text-sm font-semibold text-brand-ink transition-colors hover:bg-[#d8b440]"
      >
        <Search size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
