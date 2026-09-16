import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-server';

// POST /api/book-inspection - Anonymous inspection booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createAdminSupabaseClient();

    // Insert into contact_messages (no auth required)
    const message = [
      `📋 INSPECTION BOOKING REQUEST`,
      `Name: ${body.full_name || 'N/A'}`,
      `Phone: ${body.phone || 'N/A'}`,
      `Email: ${body.email || 'N/A'}`,
      `Property: ${body.property_interest || 'Not specified'}`,
      `Location: ${body.location || ''}, ${body.state || 'N/A'}`,
      `Preferred Date: ${body.preferred_date || 'N/A'}`,
      `Preferred Time: ${body.preferred_time || 'Any'}`,
      `Attendees: ${body.attendees || '1'}`,
      `Source: ${body.hear_about || 'Not specified'}`,
      `Notes: ${body.notes || 'None'}`,
      `Inspection Fee: ₦20,000`,
    ].join('\n');

    const { error } = await supabase.from('contact_messages').insert({
      name: body.full_name || 'Inspection Booking',
      email: body.email || 'unknown',
      phone: body.phone || '',
      subject: `Inspection Booking: ${body.property_interest || body.location || body.state || 'General'}`,
      message,
      status: 'new',
    });

    if (error) {
      console.error('Book inspection error:', error);
      return NextResponse.json({ error: 'Failed to save booking', success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Inspection booking received' });
  } catch (error) {
    console.error('Book inspection error:', error);
    return NextResponse.json({ error: 'Internal server error', success: false }, { status: 500 });
  }
}
