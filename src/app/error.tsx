'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the browser console; a real deployment would forward to Sentry.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-5 text-center">
      <h1 className="text-2xl font-bold text-brand-ink">Something went wrong</h1>
      <p className="mt-2 text-gray-500">
        We hit an unexpected error. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white"
      >
        Try again
      </button>
    </div>
  );
}
