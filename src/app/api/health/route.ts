import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Render health checks must not depend on Supabase, Resend, or other external services.
export function GET() {
  return NextResponse.json(
    { status: 'ok' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
