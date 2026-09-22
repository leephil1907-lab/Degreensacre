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
  experimental: {
    // Enable React Server Components
  },
  // Optimize for Vercel
  poweredByHeader: false,
  reactStrictMode: true,
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
        source: '/auth/reset-password',
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
