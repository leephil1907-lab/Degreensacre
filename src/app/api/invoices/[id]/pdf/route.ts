import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getInvoice, isUuid } from '@/lib/invoice-server';
import { renderInvoicePdf } from '@/lib/invoice-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

/**
 * A customer's own copy of an invoice. Authorisation comes from row-level
 * security (invoice.client_email = session e-mail), so an admin and the billed
 * client both pass — nobody else does.
 */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Please sign in to continue.', success: false }, { status: 401 });

    const invoice = await getInvoice(supabase, id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });

    const bytes = await renderInvoicePdf(invoice);
    const safeNumber = invoice.invoice_number.replace(/[^A-Za-z0-9-]/g, '');

    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Customer invoice PDF failed:', error);
    return NextResponse.json({ error: 'The PDF could not be generated.', success: false }, { status: 500 });
  }
}
