import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-forest">404</p>
      <h1 className="mt-4 font-serif text-3xl text-charcoal sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mt-4 text-gray-600">
        The link may be outdated or the listing may have been removed. Try searching our current
        inventory instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/properties"
          className="rounded-lg bg-forest px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-forest-light"
        >
          Browse properties
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-bold text-charcoal transition-colors hover:border-forest hover:text-forest"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="rounded-lg px-5 py-3 text-sm font-bold text-gray-600 transition-colors hover:text-forest"
        >
          Contact us
        </Link>
      </div>
    </div>
  );
}
