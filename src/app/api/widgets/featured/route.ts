import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('properties')
      .select('slug,title,price,area,state,images,description')
      .eq('status', 'available')
      .eq('featured', true)
      .order('date_added', { ascending: false })
      .limit(1)
      .single();

    // Fallback to static if no DB data
    if (!data) {
      return NextResponse.json({
        title: 'Exquisite 5 Bedroom Detached Duplex',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        area: 'Chevron Drive',
        state: 'Lagos',
        price: '₦180M',
        description: 'Verified • 5 Beds • 6 Baths • 450 sqm',
        url: '/properties?source=widget',
      });
    }

    const priceM = data.price >= 1000000 ? `₦${(data.price / 1000000).toFixed(0)}M` : `₦${data.price.toLocaleString()}`;
    const image = (data.images as any)?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80';

    return NextResponse.json({
      title: data.title,
      image,
      area: data.area,
      state: data.state,
      price: priceM,
      description: (data.description || '').slice(0, 80),
      url: `/properties/${data.slug}?source=widget`,
    });
  } catch (e) {
    return NextResponse.json({
      title: 'De-Greenacres Featured',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
      area: 'Lagos',
      state: 'Lagos',
      price: 'Browse now',
      description: 'Premium verified properties across Nigeria',
      url: '/properties?source=widget',
    });
  }
}
