import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-5 text-center">
      <p className="text-6xl font-extrabold text-brand-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-ink">Page not found</h1>
      <p className="mt-2 text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white"
      >
        Back to Home
      </Link>
    </div>
  );
}
