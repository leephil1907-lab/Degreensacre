import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server';
import { getPropertyBySlug, incrementPropertyView } from '@/lib/db-helpers';
import { logAudit } from '@/lib/db-helpers';

// GET /api/properties/[slug] - Get property by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const property = await getPropertyBySlug(slug);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found', success: false },
        { status: 404 }
      );
    }

    // Track view
    await incrementPropertyView(property.id);

    return NextResponse.json({ property, success: true });
  } catch (error) {
    console.error('GET /api/properties/[slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/properties/[slug] - Update property
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    // Get existing property
    const { data: existing } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Property not found', success: false },
        { status: 404 }
      );
    }

    // Check ownership or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (existing.owner_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updates: any = {};

    // Only allow updating specific fields
    const allowedFields = [
      'title', 'description', 'property_type', 'type', 'price', 'price_period',
      'bedrooms', 'bathrooms', 'toilets', 'parking', 'sqm', 'land_size',
      'furnished', 'serviced', 'gated_estate', 'address', 'area', 'lga',
      'city', 'state', 'coordinates', 'features', 'amenities', 'documentation',
      'status'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // If submitting for review
    if (body.submit === true && existing.status === 'draft') {
      updates.status = 'submitted';
    }

    const { data: property, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Property update error:', error);
      return NextResponse.json(
        { error: 'Failed to update property', success: false },
        { status: 500 }
      );
    }

    // Audit log
    await logAudit({
      user_id: user.id,
      action: 'update_property',
      entity_type: 'property',
      entity_id: property.id,
      old_values: existing,
      new_values: updates,
    });

    return NextResponse.json({ property, success: true });
  } catch (error) {
    console.error('PATCH /api/properties/[slug] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[slug] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    // Get existing property
    const { data: existing } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Property not found', success: false },
        { status: 404 }
      );
    }

    // Check ownership or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (existing.owner_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Forbidden', success: false },
        { status: 403 }
      );
    }

    // Only allow deleting drafts
    if (existing.status !== 'draft' && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Can only delete draft properties', success: false },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', existing.id);

    if (error) {
      console.error('Property deletion error:', error);
      return NextResponse.json(
        { error: 'Failed to delete property', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('DELETE /api/properties/[slug] error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
