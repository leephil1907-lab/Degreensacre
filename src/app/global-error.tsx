'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary: catches failures in the root layout itself, where the
 * normal error boundary cannot render. Must include its own <html>/<body>.
 * Styles are inline because the global stylesheet may be the thing that failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Fatal application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f7f4',
          color: '#1f2a17',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '520px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#2D5016', fontWeight: 700 }}>
            De-Greenacres Properties
          </p>
          <h1 style={{ fontSize: 28, lineHeight: 1.25, margin: '12px 0' }}>
            The site is temporarily unavailable
          </h1>
          <p style={{ color: '#4b5563', lineHeight: 1.6 }}>
            We hit an unexpected error while starting this page. Please reload in a moment. If it
            persists, contact us on +234 806 501 9971.
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              background: '#2D5016',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '12px 22px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
