import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createViewingRequest } from '@/lib/db-helpers';
import { createNotification } from '@/lib/db-helpers';
import { isEmail, isPhone, sanitizeForDb } from '@/lib/validation';

// POST /api/viewings - Schedule a viewing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to schedule a viewing', success: false },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const errors: string[] = [];
    
    if (!body.property_id) {
      errors.push('Property ID is required');
    }
    if (!body.preferred_date) {
      errors.push('Preferred date is required');
    }
    if (!body.preferred_time) {
      errors.push('Preferred time is required');
    }

    // Validate date is in the future
    if (body.preferred_date) {
      const date = new Date(body.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        errors.push('Preferred date must be in the future');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join('. '), success: false },
        { status: 400 }
      );
    }

    // Check for conflicts
    const { data: conflicts } = await supabase
      .from('viewing_requests')
      .select('id')
      .eq('property_id', body.property_id)
      .eq('preferred_date', body.preferred_date)
      .eq('preferred_time', body.preferred_time)
      .in('status', ['requested', 'confirmed'])
      .limit(1);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: 'This time slot is already booked. Please choose a different time.', success: false },
        { status: 409 }
      );
    }

    const viewing = await createViewingRequest({
      property_id: body.property_id,
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      alternative_date: body.alternative_date,
      alternative_time: body.alternative_time,
      notes: body.notes ? sanitizeForDb(body.notes) : undefined,
    });

    // Create notification for the user
    await createNotification({
      user_id: user.id,
      type: 'viewing_requested',
      title: 'Viewing Request Submitted',
      message: `Your viewing request for ${new Date(body.preferred_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${body.preferred_time} has been submitted.`,
      data: { viewing_id: viewing.id, property_id: body.property_id },
    });

    return NextResponse.json({ viewing, success: true });
  } catch (error) {
    console.error('POST /api/viewings error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule viewing', success: false },
      { status: 500 }
    );
  }
}

// GET /api/viewings - Get user's viewing requests
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

    const { data: viewings, error } = await supabase
      .from('viewing_requests')
      .select('*, properties(title, slug, images:property_images(url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ viewings, success: true });
  } catch (error) {
    console.error('GET /api/viewings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch viewings', success: false },
      { status: 500 }
    );
  }
}
