import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "De-Greenacres Properties Limited | Premium Real Estate Across Nigeria",
  description: "Don't wait to invest in Real Estate, invest in Real Estate and wait. Premium properties in Lagos, Abuja, Akwa Ibom, and Southeast Nigeria. RC: 1856064",
  keywords: "real estate Nigeria, properties Lagos, Abuja properties, Akwa Ibom land, Enugu homes, Anambra real estate, luxury homes Nigeria, property investment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
