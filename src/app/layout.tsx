import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://degreenacres.com'),
  title: {
    default: "De-Greenacres Properties Limited | Nigeria's Premium Real Estate Platform",
    template: "%s | De-Greenacres Properties"
  },
  description: "Nigeria's trusted property intelligence platform. Discover premium properties in Lagos, Abuja, Akwa Ibom & Southeast. Verified listings, investment tools, AI-powered search & expert guidance. RC: 1856064",
  keywords: [
    "real estate Nigeria",
    "properties Lagos",
    "Abuja properties",
    "Akwa Ibom land",
    "Enugu homes",
    "luxury homes Nigeria",
    "property investment Nigeria",
    "land for sale Nigeria",
    "houses for rent Lagos",
    "property valuation Nigeria",
    "real estate agents Nigeria",
    "property marketplace Nigeria",
    "investment properties Nigeria",
    "commercial real estate Nigeria",
    "diaspora property investment",
    "verified properties Nigeria",
    "property search Nigeria",
    "real estate platform Nigeria"
  ],
  authors: [{ name: "De-Greenacres Properties Limited" }],
  creator: "De-Greenacres Properties Limited",
  publisher: "De-Greenacres Properties Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://degreenacres.com",
    siteName: "De-Greenacres Properties",
    title: "De-Greenacres Properties Limited | Nigeria's Premium Real Estate Platform",
    description: "Discover premium properties across Nigeria with verified listings, AI-powered search, investment calculators, and expert guidance. Your trusted partner in real estate.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "De-Greenacres Properties - Nigeria's Premium Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "De-Greenacres Properties Limited | Nigeria's Premium Real Estate Platform",
    description: "Discover premium properties across Nigeria with verified listings, AI-powered search, and investment tools.",
    images: ["/og-image.jpg"],
    creator: "@degreenacres",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://degreenacres.com",
  },
  category: "Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "De-Greenacres Properties Limited",
              "description": "Nigeria's trusted property intelligence platform for premium real estate",
              "url": "https://degreenacres.com",
              "logo": "https://degreenacres.com/logo-icon.png",
              "image": "https://degreenacres.com/og-image.jpg",
              "telephone": "+2348065019971",
              "email": "degreenacrespropertieslimited@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NG",
                "addressRegion": "Lagos"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "6.5244",
                "longitude": "3.3792"
              },
              "areaServed": [
                {
                  "@type": "State",
                  "name": "Lagos"
                },
                {
                  "@type": "State",
                  "name": "Abuja"
                },
                {
                  "@type": "State",
                  "name": "Akwa Ibom"
                },
                {
                  "@type": "State",
                  "name": "Enugu"
                }
              ],
              "priceRange": "₦₦₦",
              "openingHours": "Mo-Fr 09:00-18:00",
              "sameAs": [
                "https://twitter.com/degreenacres",
                "https://facebook.com/degreenacres",
                "https://instagram.com/degreenacres"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
          <WhatsAppFloat />
        </Providers>
      </body>
    </html>
  );
}
