import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();

  const { name, email, phone, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: 'Name, email, subject, and message are required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .insert({ name, email, phone, subject, message, status: 'new' })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: data }, { status: 201 });
}
