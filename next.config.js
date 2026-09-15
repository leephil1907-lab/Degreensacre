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
};

module.exports = nextConfig;
