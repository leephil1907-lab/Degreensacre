import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin-auth';
import { getInvoice, isUuid } from '@/lib/invoice-server';
import { renderInvoiceHtml } from '@/lib/invoice-html';
import { amountInWords, effectiveStatus, invoiceBalance, STATUS_LABELS } from '@/lib/invoices';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ id: string }> };

function csvCell(value: unknown): string {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

// GET /api/admin/invoices/[id]/export?format=html|csv[&download=1]
export async function GET(request: NextRequest, { params }: Params) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: 'Invalid invoice id.', success: false }, { status: 400 });

  const format = (request.nextUrl.searchParams.get('format') || 'html').toLowerCase();
  const download = request.nextUrl.searchParams.get('download') === '1';

  try {
    const invoice = await getInvoice(auth.context.supabase, id);
    if (!invoice) return NextResponse.json({ error: 'Invoice not found.', success: false }, { status: 404 });

    const safeNumber = invoice.invoice_number.replace(/[^A-Za-z0-9-]/g, '');

    if (format === 'csv') {
      const rows: string[][] = [
        ['Invoice', invoice.invoice_number],
        ['Status', STATUS_LABELS[effectiveStatus(invoice)]],
        ['Issue date', invoice.issue_date],
        ['Due date', invoice.due_date ?? ''],
        ['Client', invoice.client_name],
        ['Client email', invoice.client_email ?? ''],
        ['Client phone', invoice.client_phone ?? ''],
        ['Property', invoice.property_title ?? ''],
        [],
        ['#', 'Description', 'Quantity', 'Unit price (NGN)', 'Amount (NGN)'],
        ...invoice.invoice_items.map((item, index) => [
          String(index + 1),
          item.description,
          String(item.quantity),
          Number(item.unit_price).toFixed(2),
          Number(item.amount).toFixed(2),
        ]),
        [],
        ['Subtotal (NGN)', invoice.subtotal.toFixed(2)],
        ['Discount (NGN)', invoice.discount.toFixed(2)],
        [`VAT ${invoice.tax_rate}% (NGN)`, invoice.tax_amount.toFixed(2)],
        ['Total (NGN)', invoice.total.toFixed(2)],
        ['Amount paid (NGN)', invoice.amount_paid.toFixed(2)],
        ['Balance due (NGN)', invoiceBalance(invoice).toFixed(2)],
        ['Amount in words', amountInWords(invoice.total)],
      ];

      const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeNumber}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    const html = renderInvoiceHtml(invoice);
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${safeNumber}.html"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Invoice export failed:', error);
    return NextResponse.json({ error: 'The export could not be generated.', success: false }, { status: 500 });
  }
}
