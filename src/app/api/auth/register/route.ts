import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase-server';

// POST /api/auth/register — Server-side signup with profile creation
// Uses service role key so no SQL trigger needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, phone, state, account_type } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required', success: false }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters', success: false }, { status: 400 });
    }

    const adminSupabase = await createAdminSupabaseClient();

    // 1. Create auth user using admin API
    const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { first_name, last_name, phone, state, account_type },
    });

    if (authError) {
      // Check if user already exists
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email already exists', success: false }, { status: 409 });
      }
      throw authError;
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user', success: false }, { status: 500 });
    }

    // 2. Create profile record (service role bypasses RLS)
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: first_name || '',
        last_name: last_name || '',
        phone: phone || null,
        state: state || null,
        country: 'Nigeria',
        account_type: account_type || 'buyer',
        is_admin: false,
        is_verified: false,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Auth user created but profile failed — not fatal
    }

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email },
    });
  } catch (error: any) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed', success: false },
      { status: 500 }
    );
  }
}
