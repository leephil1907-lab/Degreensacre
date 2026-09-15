import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getUserSavedProperties, toggleSavedProperty } from '@/lib/db-helpers';

// GET /api/saved - Get saved properties
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

    const properties = await getUserSavedProperties(user.id);
    return NextResponse.json({ properties, success: true });
  } catch (error) {
    console.error('GET /api/saved error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved properties', success: false },
      { status: 500 }
    );
  }
}

// POST /api/saved - Toggle saved property
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
    if (!body.property_id) {
      return NextResponse.json(
        { error: 'Property ID is required', success: false },
        { status: 400 }
      );
    }

    const result = await toggleSavedProperty(user.id, body.property_id);
    return NextResponse.json({ ...result, success: true });
  } catch (error) {
    console.error('POST /api/saved error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle saved property', success: false },
      { status: 500 }
    );
  }
}
