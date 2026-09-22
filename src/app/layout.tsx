import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieConsent from "@/components/CookieConsent";
import LocationPermission from "@/components/LocationPermission";
import PWARegister from "@/components/PWARegister";
import { Providers } from "@/components/Providers";
import { GoogleAdsenseScript } from "@/components/GoogleAdsense";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#283818" },
    { media: "(prefers-color-scheme: dark)", color: "#1a2810" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://degreenacres.com'),
  title: {
    default: "De-Greenacres Properties Limited | Nigeria's Premium Real Estate Platform",
    template: "%s | De-Greenacres Properties"
  },
  description: "Nigeria's trusted property intelligence platform. Discover premium properties in Lagos, Abuja, Akwa Ibom & Southeast. Verified listings, investment tools, AI-powered search & expert guidance. RC: 1856064",
  applicationName: "De-Greenacres",
  referrer: "origin-when-cross-origin",
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
  authors: [{ name: "De-Greenacres Properties Limited", url: "https://degreenacres.com" }],
  creator: "De-Greenacres Properties Limited",
  publisher: "De-Greenacres Properties Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "De-Greenacres",
    startupImage: [
      { url: "/logo-icon.png", media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" },
    ],
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
    creator: "@degreensacre",
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
  verification: {
    google: "cd6av_JGPdYYcZvR1EY8DLa8ttGhfgCIl_pjoSu3cPQ",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/logo-icon.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA — explicit for Lighthouse, also covered by metadata.manifest */}
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="De-Greenacres" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        {/* Maskable icon hint for Android */}
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        {/* Google AdSense — loads only when NEXT_PUBLIC_GOOGLE_ADSENSE_ID is set to real ca-pub-... */}
        <GoogleAdsenseScript />
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
                { "@type": "State", "name": "Lagos" },
                { "@type": "State", "name": "Abuja" },
                { "@type": "State", "name": "Akwa Ibom" },
                { "@type": "State", "name": "Enugu" }
              ],
              "priceRange": "₦₦₦",
              "openingHours": "Mo-Fr 09:00-18:00",
              "sameAs": []
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
          <CookieConsent />
          <LocationPermission />
          <PWARegister />
        </Providers>
      </body>
    </html>
  );
}
