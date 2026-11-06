import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';
import { getPropertyBySlug } from '@/lib/db-helpers';
import { getSiteUrl } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `${getSiteUrl()}/properties/${encodeURIComponent(slug)}`;

  try {
    // Query directly instead of calling our own HTTP API. Apart from avoiding a
    // fragile build-time self-request, this prevents metadata generation from
    // incrementing the public property-view counter a second time.
    const property = await getPropertyBySlug(slug);

    if (property) {
      const description = property.description?.replace(/\s+/g, ' ').trim().substring(0, 160)
        || `${property.property_type} for ${property.type} in ${property.area}, ${property.state}`;
      const images = property.property_images?.[0]?.url ? [{ url: property.property_images[0].url }] : [];

      return {
        title: property.title,
        description,
        alternates: { canonical },
        openGraph: {
          title: property.title,
          description,
          url: canonical,
          images,
        },
        twitter: {
          card: 'summary_large_image',
          title: property.title,
          description,
          images: property.property_images?.[0]?.url ? [property.property_images[0].url] : [],
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate property metadata:', error);
  }

  return {
    title: 'Property details',
    description: 'View property details on De-Greenacres Properties.',
    alternates: { canonical },
    robots: { index: false, follow: false },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  return <PropertyDetailClient params={params} />;
}
