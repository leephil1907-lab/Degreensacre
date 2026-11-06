/**
 * Canonical origin for metadata, structured data, robots, sitemap, and auth links.
 * Set NEXT_PUBLIC_SITE_URL to the public site URL. Render also provides
 * RENDER_EXTERNAL_URL automatically for its onrender.com service URL.
 */
function normalizeSiteUrl(value: string | undefined): string | null {
  const candidate = value?.trim().replace(/\/+$/, '');
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
    const validProtocol = url.protocol === 'https:' || (
      url.protocol === 'http:' && isLocal && process.env.NODE_ENV !== 'production'
    );
    return validProtocol ? url.toString().replace(/\/+$/, '') : null;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const configured = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  const renderUrl = normalizeSiteUrl(process.env.RENDER_EXTERNAL_URL);

  if (configured) return configured;
  if (renderUrl) return renderUrl;

  return process.env.NODE_ENV === 'production'
    ? 'https://degreensacre.onrender.com'
    : 'http://localhost:3000';
}

export const SITE_NAME = 'De-Greenacres Properties Limited';
export const SITE_TAGLINE = "Nigeria's Premium Real Estate Platform";
