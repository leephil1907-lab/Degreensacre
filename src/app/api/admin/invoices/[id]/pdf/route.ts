import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-auth';
import { getInvoice, isUuid } from '@/lib/invoice-server';
import { renderInvoicePdf } from '@/lib/invoice-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/invoices/[id]/pdf — branded, print-ready PDF
export async function GET(_request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  try {
    const invoice = await getInvoice(auth.context.supabase, id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });

    const bytes = await renderInvoicePdf(invoice);
    const safeNumber = invoice.invoice_number.replace(/[^A-Za-z0-9-]/g, '');

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeNumber}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Invoice PDF generation failed:', error);
    return NextResponse.json({ error: 'The PDF could not be generated.', success: false }, { status: 500 });
  }
}
