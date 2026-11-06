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
