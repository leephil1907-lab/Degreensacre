const apiCorsOrigin = process.env.CORS_ALLOWED_ORIGIN?.trim() || '*';

const apiCorsHeaders = [
  { key: 'Access-Control-Allow-Origin', value: apiCorsOrigin },
  { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
  },
  { key: 'Vary', value: 'Origin' },
];

// Wildcard CORS cannot be combined with credentialed browser requests.
if (apiCorsOrigin !== '*') {
  apiCorsHeaders.push({ key: 'Access-Control-Allow-Credentials', value: 'true' });
}

// Content-Security-Policy.
// Hosts are allow-listed for the integrations the app actually ships:
// Supabase (REST/Realtime), OpenStreetMap (tiles + embedded maps), Cloudflare
// cdnjs (Leaflet marker sprites), Google Analytics and Google AdSense (both
// only activate when their env vars are configured), plus the tour/embed hosts
// used by the (hidden) virtual-tour viewer.
// NOTE: script-src keeps 'unsafe-inline' because Next.js emits inline bootstrap
// and JSON-LD scripts. A nonce-based policy via src/proxy.ts is the next step up
// and should be introduced with full-page QA.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://tpc.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://adservice.google.com https://fundingchoicesmessages.google.com https://ep1.adtrafficquality.google",
  "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com",
  "img-src 'self' data: blob: https://degreenacres.org https://*.degreenacres.org https://degreensacre.onrender.com https://*.supabase.co https://images.unsplash.com https://cdnjs.cloudflare.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://www.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.doubleclick.net https://*.googleusercontent.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://*.doubleclick.net",
  "frame-src 'self' https://www.openstreetmap.org https://www.google.com https://maps.google.com https://*.matterport.com https://*.kuula.co https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  'upgrade-insecure-requests',
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'rvwirpfclysapqtnrlvx.supabase.co',
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  // Development-only: permit HMR from the hosted sandbox preview. This setting
  // is not used by the production Node server.
  allowedDevOrigins: process.env.NODE_ENV === 'development' ? ['*.e2b.app'] : [],
  // Canonical auth routes: /signin, /signup, /forgot-password
  // Legacy /auth/* paths 301 -> canonical to avoid duplicate content
  async redirects() {
    return [
      {
        source: '/auth/login',
        destination: '/signin',
        permanent: true,
      },
      {
        source: '/auth/register',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/auth/forgot-password',
        destination: '/forgot-password',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: apiCorsHeaders,
      },
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: cspDirectives },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Content-Type', value: 'application/manifest+json' },
          { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
