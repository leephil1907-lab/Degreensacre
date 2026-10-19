/**
 * Canonical origin for metadata, structured data, robots, and sitemap.
 * Set NEXT_PUBLIC_SITE_URL to the verified production domain in Vercel.
 * Vercel URL remains the fallback until custom-domain DNS is confirmed.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured && /^https:\/\//i.test(configured) && !configured.includes("localhost")) return configured;
  return "https://degreensacre.vercel.app";
}

export const SITE_NAME = "De-Greenacres Properties Limited";
export const SITE_TAGLINE = "Nigeria's Premium Real Estate Platform";