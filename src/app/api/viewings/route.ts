import { notifyEvents, teamNotice } from '@/lib/email-events';
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createViewingRequest } from '@/lib/db-helpers';
import { createNotification } from '@/lib/db-helpers';
import { isUuid, sanitizeForDb } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';

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
    const limit = checkRateLimit(`viewing:${user.id}`, 20, 24 * 60 * 60 * 1000);
    if (!limit.allowed) return NextResponse.json({ error: 'Daily viewing request limit reached. Please try again tomorrow.', success: false }, { status: 429 });

    const body = await request.json();
    
    // Validate input
    const errors: string[] = [];
    
    if (!isUuid(String(body.property_id || ''))) {
      errors.push('A valid property ID is required');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.preferred_date || ''))) {
      errors.push('A valid preferred date is required');
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(body.preferred_time || ''))) {
      errors.push('A valid preferred time is required');
    }
    if (body.notes && String(body.notes).length > 2000) errors.push('Notes must be 2,000 characters or fewer');

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

    // The viewing is already persisted; a secondary notification must not turn
    // that successful request into a false failure response.
    try {
      await createNotification({
        user_id: user.id,
        type: 'viewing_requested',
        title: 'Viewing Request Submitted',
        message: `Your viewing request for ${new Date(body.preferred_date).toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${body.preferred_time} has been submitted.`,
        data: { viewing_id: viewing.id, property_id: body.property_id },
      });
    } catch (notificationError) {
      console.warn('Viewing saved but notification failed:', notificationError);
    }

    notifyEvents([...(user.email ? [{ event: 'inspection_requested' as const, to: user.email, recordId: viewing.id, data: { details: { 'Requested date': body.preferred_date, 'Requested time': body.preferred_time, Status: 'Awaiting confirmation' } } }] : []), ...teamNotice('admin_inspection', viewing.id)]);
    return NextResponse.json({ viewing, success: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return NextResponse.json({ error: 'This time slot has just been reserved. Please choose another time.', success: false }, { status: 409 });
    }
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
