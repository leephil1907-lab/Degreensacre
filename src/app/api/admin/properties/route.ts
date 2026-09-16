import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server';
import { logAdminActivity } from '@/lib/db-helpers';
import { sanitizeForDb } from '@/lib/validation';

// GET /api/admin/properties - Get all properties for moderation
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminSupabase = await createAdminSupabaseClient();

    let query = adminSupabase
      .from('properties')
      .select('*, property_images(url, display_order), profiles(first_name, last_name, email)', { count: 'exact' });

    if (searchParams.get('status')) {
      query = query.eq('status', searchParams.get('status')!);
    }
    if (searchParams.get('verification_status')) {
      query = query.eq('verification_status', searchParams.get('verification_status')!);
    }
    if (searchParams.get('search')) {
      query = query.ilike('title', `%${searchParams.get('search')}%`);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    query = query
      .order('date_added', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: properties, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      properties,
      count,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      success: true,
    });
  } catch (error) {
    console.error('GET /api/admin/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/properties - Moderate property (approve, reject, publish, verify)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    if (!body.property_id) {
      return NextResponse.json(
        { error: 'Property ID is required', success: false },
        { status: 400 }
      );
    }

    const adminSupabase = await createAdminSupabaseClient();
    const updates: any = {};

    switch (body.action) {
      case 'approve':
        updates.status = 'published';
        updates.published_at = new Date().toISOString();
        break;
      case 'reject':
        updates.status = 'rejected';
        break;
      case 'withdraw':
        updates.status = 'withdrawn';
        break;
      case 'verify':
        updates.verification_status = 'verified';
        break;
      case 'unverify':
        updates.verification_status = 'unverified';
        break;
      case 'feature':
        updates.featured = !body.current_featured;
        break;
      case 'update_status':
        if (body.new_status) {
          updates.status = body.new_status;
          if (body.new_status === 'published') {
            updates.published_at = new Date().toISOString();
          }
        }
        break;
      case 'add_note':
        // Add admin note (would need a notes field or separate table)
        updates.admin_notes = body.note;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    if (body.verification_status) {
      updates.verification_status = body.verification_status;
    }

    const { data: property, error } = await adminSupabase
      .from('properties')
      .update(updates)
      .eq('id', body.property_id)
      .select()
      .single();

    if (error) throw error;

    // Log admin activity
    await logAdminActivity({
      admin_id: user.id,
      action: body.action,
      entity_type: 'property',
      entity_id: body.property_id,
      details: { new_status: property?.status, note: body.note },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ property, success: true });
  } catch (error) {
    console.error('PATCH /api/admin/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to moderate property', success: false },
      { status: 500 }
    );
  }
}

// POST /api/admin/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const body = await request.json();
    const adminSupabase = await createAdminSupabaseClient();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 80) + '-' + Date.now().toString(36);

    const propertyData = {
      slug,
      title: sanitizeForDb(body.title),
      description: sanitizeForDb(body.description || ''),
      property_type: sanitizeForDb(body.property_type || 'House'),
      type: body.type || 'sale',
      price: body.price || 0,
      price_period: body.price_period || null,
      bedrooms: body.bedrooms || 0,
      bathrooms: body.bathrooms || 0,
      sqm: body.sqm || 0,
      parking: body.parking || 0,
      state: sanitizeForDb(body.state || ''),
      area: sanitizeForDb(body.area || ''),
      lga: sanitizeForDb(body.lga || ''),
      address: sanitizeForDb(body.address || ''),
      features: body.features || [],
      documentation: sanitizeForDb(body.documentation || ''),
      status: body.status || 'available',
      verification_status: 'pending',
      featured: body.featured || false,
      owner_id: user.id,
      date_added: new Date().toISOString(),
    };

    const { data: property, error } = await adminSupabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();

    if (error) throw error;

    // Add images if provided
    if (body.image_urls && body.image_urls.length > 0 && property) {
      const images = body.image_urls.map((url: string, index: number) => ({
        property_id: property.id,
        url: sanitizeForDb(url),
        display_order: index,
        is_primary: index === 0,
      }));
      await adminSupabase.from('property_images').insert(images);
    }

    await logAdminActivity({
      admin_id: user.id,
      action: 'create',
      entity_type: 'property',
      entity_id: property?.id || '',
      details: { title: body.title },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
    });

    return NextResponse.json({ property, success: true });
  } catch (error: any) {
    console.error('POST /api/admin/properties error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create property', success: false }, { status: 500 });
  }
}

// PUT /api/admin/properties - Update a property
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Property ID required', success: false }, { status: 400 });

    const body = await request.json();
    const adminSupabase = await createAdminSupabaseClient();

    const updates: any = {
      title: sanitizeForDb(body.title),
      description: sanitizeForDb(body.description || ''),
      property_type: sanitizeForDb(body.property_type || 'House'),
      type: body.type || 'sale',
      price: body.price || 0,
      price_period: body.price_period || null,
      bedrooms: body.bedrooms || 0,
      bathrooms: body.bathrooms || 0,
      sqm: body.sqm || 0,
      parking: body.parking || 0,
      state: sanitizeForDb(body.state || ''),
      area: sanitizeForDb(body.area || ''),
      lga: sanitizeForDb(body.lga || ''),
      address: sanitizeForDb(body.address || ''),
      features: body.features || [],
      documentation: sanitizeForDb(body.documentation || ''),
      status: body.status || 'available',
      featured: body.featured || false,
    };

    const { data: property, error } = await adminSupabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update images if provided
    if (body.image_urls !== undefined) {
      await adminSupabase.from('property_images').delete().eq('property_id', id);
      if (body.image_urls && body.image_urls.length > 0) {
        const images = body.image_urls.map((url: string, index: number) => ({
          property_id: id,
          url: sanitizeForDb(url),
          display_order: index,
          is_primary: index === 0,
        }));
        await adminSupabase.from('property_images').insert(images);
      }
    }

    return NextResponse.json({ property, success: true });
  } catch (error: any) {
    console.error('PUT /api/admin/properties error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update property', success: false }, { status: 500 });
  }
}

// DELETE /api/admin/properties - Delete a property
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });

    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden', success: false }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Property ID required', success: false }, { status: 400 });

    const adminSupabase = await createAdminSupabaseClient();

    // Delete images first
    await adminSupabase.from('property_images').delete().eq('property_id', id);
    // Delete property
    const { error } = await adminSupabase.from('properties').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/admin/properties error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete property', success: false }, { status: 500 });
  }
}
