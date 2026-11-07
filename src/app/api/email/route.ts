import { NextRequest, NextResponse } from 'next/server';
import { POST as saveContact } from '@/app/api/contact/route';

// Legacy compatibility only: never accept arbitrary email events or recipients.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body?.type !== 'contact') return NextResponse.json({ success: false, error: 'Unsupported email action.' }, { status: 400 });
    const forwarded = new NextRequest(request.url, { method: 'POST', headers: request.headers, body: JSON.stringify(body.data || {}) });
    return saveContact(forwarded);
  } catch { return NextResponse.json({ success: false, error: 'Invalid contact request.' }, { status: 400 }); }
}
