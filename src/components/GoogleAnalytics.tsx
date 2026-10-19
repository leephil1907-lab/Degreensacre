"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim();

export default function GoogleAnalytics() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics-4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag("js", new Date());
gtag("config", "${GA_ID}", { anonymize_ip: true });`}
      </Script>
    </>
  );
}