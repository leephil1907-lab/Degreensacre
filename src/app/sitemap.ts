import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/land`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/book-inspection`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/list-property`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/submit-property`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/diaspora`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/developments`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/location/lagos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/location/abuja`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/location/enugu`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/location/akwa-ibom`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/location/port-harcourt`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/location/uyo`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}