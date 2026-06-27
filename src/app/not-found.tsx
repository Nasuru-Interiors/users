import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-brand-bg px-5 text-center">
      <p className="font-serif text-7xl font-semibold text-brand-primary">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-brand-ink">Page not found</h1>
      <p className="mt-2 text-brand-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
