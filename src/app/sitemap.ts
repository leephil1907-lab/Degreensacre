import { MetadataRoute } from 'next';

const baseUrl = 'https://degreenacres.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Core pages
    { url: `${baseUrl}`, lastModified: new Date('2026-09-16'), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.7 },

    // Property pages
    { url: `${baseUrl}/properties`, lastModified: new Date('2026-09-16'), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/land`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.9 },

    // Services
    { url: `${baseUrl}/book-inspection`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/sell`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/list-property`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/submit-property`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/diaspora`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/developments`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/insights`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.7 },

    // Location pages
    { url: `${baseUrl}/locations`, lastModified: new Date('2026-09-16'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/location/lagos`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/location/abuja`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/location/enugu`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/location/akwa-ibom`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/location/port-harcourt`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/location/uyo`, lastModified: new Date('2026-09-16'), changeFrequency: 'weekly', priority: 0.6 },

    // Auth pages
    { url: `${baseUrl}/signin`, lastModified: new Date('2026-09-16'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/signup`, lastModified: new Date('2026-09-16'), changeFrequency: 'yearly', priority: 0.3 },

    // Legal pages
    { url: `${baseUrl}/privacy`, lastModified: new Date('2026-09-16'), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date('2026-09-16'), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
