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
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-brand-bg px-5 text-center">
      <h1 className="font-serif text-2xl font-semibold text-brand-ink">Something went wrong</h1>
      <p className="mt-2 text-brand-muted">
        We hit an unexpected error. Please try again in a moment.
      </p>
      <button onClick={reset} className="btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
