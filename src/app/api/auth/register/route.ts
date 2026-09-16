import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// POST /api/auth/register — Server-side signup with profile creation
// Falls back to regular signUp if service role key is not available
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

    const supabase = createServerClient();

    // Use regular signUp (works with anon key)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name, phone, state, account_type },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'An account with this email already exists', success: false }, { status: 409 });
      }
      throw authError;
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user', success: false }, { status: 500 });
    }

    // Try to create profile (may fail if RLS blocks it — SQL trigger handles it as backup)
    try {
      await supabase.from('profiles').insert({
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
    } catch (profileError) {
      console.error('Profile creation error (trigger will handle):', profileError);
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
