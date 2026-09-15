import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sanitizeForDb, isPhone, NIGERIAN_STATES } from '@/lib/validation';

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Profile not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error('GET /api/profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', success: false },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update profile
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

    const body = await request.json();
    const updates: any = {};

    // Allowed fields
    const allowedFields: Record<string, (value: any) => any> = {
      first_name: (v) => sanitizeForDb(v),
      last_name: (v) => sanitizeForDb(v),
      phone: (v) => v ? sanitizeForDb(v) : null,
      country: (v) => sanitizeForDb(v),
      state: (v) => v && NIGERIAN_STATES.includes(v) ? v : null,
      bio: (v) => sanitizeForDb(v),
    };

    for (const [field, transform] of Object.entries(allowedFields)) {
      if (body[field] !== undefined) {
        updates[field] = transform(body[field]);
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', success: false },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: 'Failed to update profile', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({ profile, success: true });
  } catch (error) {
    console.error('PATCH /api/profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
