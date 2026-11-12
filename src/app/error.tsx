'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Route-level error boundary. Catches render/data errors in any page below the
 * root layout so visitors see a branded recovery screen instead of a blank page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the digest so the same failure can be found in platform logs.
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-forest">Something went wrong</p>
      <h1 className="mt-4 font-serif text-3xl text-charcoal sm:text-4xl">
        We could not load this page
      </h1>
      <p className="mt-4 text-gray-600">
        The page hit an unexpected problem. You can try again, or continue browsing available
        properties.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-forest px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-light"
        >
          Try again
        </button>
        <Link
          href="/properties"
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-charcoal transition-colors hover:border-forest hover:text-forest"
        >
          Browse properties
        </Link>
        <Link
          href="/"
          className="rounded-lg px-5 py-3 text-sm font-bold text-gray-600 transition-colors hover:text-forest"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
