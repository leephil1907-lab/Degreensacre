import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/properties/${slug}`, {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      const property = data.property;
      
      if (property) {
        return {
          title: `${property.title} | De-Greenacres Properties`,
          description: property.description?.substring(0, 160) || `${property.property_type} for ${property.type} in ${property.area}, ${property.state}`,
          openGraph: {
            title: property.title,
            description: property.description?.substring(0, 160),
            images: property.property_images?.[0]?.url ? [{ url: property.property_images[0].url }] : [],
          },
        };
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error);
  }

  return {
    title: 'Property | De-Greenacres Properties',
    description: 'View property details on De-Greenacres Properties',
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  return <PropertyDetailClient params={params} />;
}
