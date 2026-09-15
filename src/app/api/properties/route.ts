import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getProperties } from '@/lib/db-helpers';
import { sanitize, sanitizeForDb, PROPERTY_TYPES, NIGERIAN_STATES } from '@/lib/validation';

// GET /api/properties - List properties with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: any = {};
    
    // Parse filter parameters
    if (searchParams.get('type')) filters.type = searchParams.get('type');
    if (searchParams.get('state')) filters.state = searchParams.get('state');
    if (searchParams.get('area')) filters.area = searchParams.get('area');
    if (searchParams.get('minPrice')) filters.minPrice = parseInt(searchParams.get('minPrice')!);
    if (searchParams.get('maxPrice')) filters.maxPrice = parseInt(searchParams.get('maxPrice')!);
    if (searchParams.get('bedrooms')) filters.bedrooms = parseInt(searchParams.get('bedrooms')!);
    if (searchParams.get('featured')) filters.featured = searchParams.get('featured') === 'true';
    if (searchParams.get('status')) filters.status = searchParams.get('status');
    if (searchParams.get('limit')) filters.limit = parseInt(searchParams.get('limit')!);
    if (searchParams.get('offset')) filters.offset = parseInt(searchParams.get('offset')!);
    if (searchParams.get('orderBy')) filters.orderBy = searchParams.get('orderBy');
    if (searchParams.get('order')) filters.orderDirection = searchParams.get('order') as 'asc' | 'desc';

    const { properties, count } = await getProperties(filters);

    return NextResponse.json({ properties, count, success: true });
  } catch (error) {
    console.error('GET /api/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', success: false },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property (requires auth)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const errors: string[] = [];
    if (!body.title || body.title.trim().length < 5) errors.push('Title is required (min 5 characters)');
    if (!body.property_type) errors.push('Property type is required');
    if (!body.type || !PROPERTY_TYPES.includes(body.type)) errors.push('Valid listing type is required');
    if (!body.price || body.price <= 0) errors.push('Valid price is required');
    if (!body.state || !NIGERIAN_STATES.includes(body.state)) errors.push('Valid state is required');
    if (!body.area || body.area.trim().length < 2) errors.push('Area is required');
    if (!body.description || body.description.trim().length < 50) errors.push('Description is required (min 50 characters)');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('. '), success: false },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);

    const propertyData = {
      slug,
      title: sanitizeForDb(body.title),
      description: sanitizeForDb(body.description || ''),
      property_type: sanitizeForDb(body.property_type),
      type: body.type,
      price: parseInt(body.price),
      price_period: body.price_period || null,
      bedrooms: parseInt(body.bedrooms) || 0,
      bathrooms: parseInt(body.bathrooms) || 0,
      toilets: parseInt(body.toilets) || 0,
      parking: parseInt(body.parking) || 0,
      sqm: parseInt(body.sqm) || 0,
      land_size: body.land_size ? parseInt(body.land_size) : null,
      furnished: Boolean(body.furnished),
      serviced: Boolean(body.serviced),
      gated_estate: Boolean(body.gated_estate),
      address: sanitizeForDb(body.address || ''),
      area: sanitizeForDb(body.area),
      lga: sanitizeForDb(body.lga || ''),
      city: sanitizeForDb(body.city || ''),
      state: body.state,
      coordinates: body.coordinates || null,
      features: body.features || [],
      amenities: body.amenities || [],
      documentation: sanitizeForDb(body.documentation || ''),
      owner_id: user.id,
      status: 'draft',
      verification_status: 'pending',
    };

    const { data: property, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();

    if (error) {
      console.error('Property creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create property', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ property, success: true });
  } catch (error) {
    console.error('POST /api/properties error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
