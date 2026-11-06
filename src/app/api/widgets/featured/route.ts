import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('properties')
      .select('slug,title,price,area,state,images,description')
      .eq('status', 'available')
      .eq('featured', true)
      .order('date_added', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({
        title: 'No featured properties yet',
        image: '/property-placeholder.svg',
        area: '',
        state: '',
        price: '',
        description: 'Browse all currently available properties.',
        url: '/properties?source=widget',
      });
    }

    const price = Number(data.price);
    const formattedPrice = price >= 1000000
      ? `₦${(price / 1000000).toLocaleString('en-NG', { maximumFractionDigits: 2 })}M`
      : `₦${price.toLocaleString('en-NG')}`;

    return NextResponse.json({
      title: data.title,
      image: Array.isArray(data.images) && typeof data.images[0] === 'string'
        ? data.images[0]
        : '/property-placeholder.svg',
      area: data.area,
      state: data.state,
      price: formattedPrice,
      description: (data.description || '').slice(0, 80),
      url: `/properties/${data.slug}?source=widget`,
    });
  } catch (error) {
    console.error('GET /api/widgets/featured error:', error);
    return NextResponse.json(
      { error: 'Featured properties are temporarily unavailable.' },
      { status: 503 },
    );
  }
}
