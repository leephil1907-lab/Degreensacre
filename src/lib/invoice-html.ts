import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  amountInWords,
  COMPANY,
  effectiveStatus,
  formatNaira,
  invoiceBalance,
  STATUS_LABELS,
  type Invoice,
} from './invoices';

let cachedLogo: string | null = null;

/** Logo inlined as a data URI so the downloaded HTML file is self-contained. */
function logoDataUri(): string {
  if (cachedLogo !== null) return cachedLogo;
  try {
    const file = path.join(process.cwd(), 'public', 'logo-256.png');
    cachedLogo = `data:image/png;base64,${readFileSync(file).toString('base64')}`;
  } catch {
    cachedLogo = '';
  }
  return cachedLogo;
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Printable invoice document. One source of truth for the on-screen preview,
 * the .html download and the browser's "Print → Save as PDF".
 */
export function renderInvoiceHtml(invoice: Invoice): string {
  const status = effectiveStatus(invoice);
  const balance = invoiceBalance(invoice);
  const logo = logoDataUri();
  const items = invoice.invoice_items ?? [];

  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td class="num muted">${index + 1}</td>
          <td>${escapeHtml(item.description)}</td>
          <td class="num">${Number(item.quantity).toLocaleString('en-NG')}</td>
          <td class="num">${formatNaira(Number(item.unit_price), true)}</td>
          <td class="num strong">${formatNaira(Number(item.amount), true)}</td>
        </tr>`,
    )
    .join('');

  const bankLines = [invoice.bank_name, invoice.bank_account_name, invoice.bank_account_number]
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(invoice.invoice_number)} · ${escapeHtml(invoice.client_name)}</title>
<style>
  :root { --forest:#315c49; --forest-dark:#274b3c; --ink:#1a1a18; --muted:#6b7280; --line:#e5e7eb; --cream:#f7f8f4; }
  * { box-sizing: border-box; }
  body { margin:0; background:#eef0ea; color:var(--ink); font-family:"Helvetica Neue", Helvetica, Arial, sans-serif; font-size:12.5px; line-height:1.5; }
  .sheet { width:210mm; min-height:297mm; margin:16px auto; background:#fff; padding:16mm 14mm 12mm; box-shadow:0 10px 30px rgba(0,0,0,.12); position:relative; }
  header { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; padding-bottom:16px; border-bottom:3px solid var(--forest); }
  .brand { display:flex; gap:14px; align-items:center; }
  .brand img { width:64px; height:64px; object-fit:contain; }
  .brand h1 { margin:0; font-size:16px; letter-spacing:.02em; }
  .brand p { margin:2px 0 0; font-size:11px; color:var(--muted); }
  .doc { text-align:right; }
  .doc h2 { margin:0; font-size:26px; letter-spacing:.14em; color:var(--forest); font-weight:700; }
  .doc .number { margin-top:4px; font-size:13px; font-weight:700; }
  .pill { display:inline-block; margin-top:6px; padding:4px 10px; border-radius:999px; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; background:var(--cream); color:var(--forest); border:1px solid var(--line); }
  .pill.paid { background:#e8f3ec; color:#1f6b3f; border-color:#cfe6d8; }
  .pill.overdue { background:#fdeceb; color:#a52a1f; border-color:#f6d3d0; }
  .pill.void { background:#f3f4f6; color:#6b7280; }
  .meta { display:grid; grid-template-columns:1.3fr 1fr; gap:22px; margin:18px 0 14px; }
  .block h3 { margin:0 0 6px; font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
  .block p { margin:0 0 2px; }
  .block .name { font-size:13.5px; font-weight:700; }
  .facts { display:grid; grid-template-columns:auto auto; gap:2px 14px; justify-content:end; text-align:right; }
  .facts dt { color:var(--muted); font-size:11px; }
  .facts dd { margin:0; font-weight:600; font-size:11.5px; }
  table.items { width:100%; border-collapse:collapse; margin-top:6px; }
  table.items thead th { background:var(--forest); color:#fff; font-size:10px; letter-spacing:.1em; text-transform:uppercase; padding:9px 10px; text-align:left; }
  table.items thead th.num { text-align:right; }
  table.items tbody td { padding:9px 10px; border-bottom:1px solid var(--line); vertical-align:top; }
  table.items tbody tr:nth-child(even) td { background:#fbfcfa; }
  .num { text-align:right; white-space:nowrap; }
  .muted { color:var(--muted); }
  .strong { font-weight:700; }
  .summary { display:flex; justify-content:flex-end; margin-top:14px; }
  .summary table { border-collapse:collapse; min-width:250px; }
  .summary td { padding:5px 0 5px 24px; }
  .summary td.value { text-align:right; font-weight:600; white-space:nowrap; }
  .summary tr.total td { border-top:2px solid var(--forest); padding-top:9px; font-size:15px; font-weight:700; color:var(--forest); }
  .summary tr.balance td { font-weight:700; }
  .words { margin-top:10px; padding:9px 12px; background:var(--cream); border-left:3px solid var(--forest); font-size:11.5px; }
  .pay { display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:18px; }
  .card { border:1px solid var(--line); border-radius:8px; padding:12px 14px; }
  .card h3 { margin:0 0 6px; font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); }
  .card p { margin:0 0 2px; }
  footer { position:absolute; left:14mm; right:14mm; bottom:10mm; border-top:1px solid var(--line); padding-top:8px; display:flex; justify-content:space-between; gap:12px; font-size:10px; color:var(--muted); }
  @media print {
    body { background:#fff; }
    .sheet { width:auto; min-height:auto; margin:0; padding:12mm; box-shadow:none; }
    .sheet + .sheet { page-break-before:always; }
    @page { size:A4; margin:10mm; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div class="brand">
        ${logo ? `<img src="${logo}" alt="${escapeHtml(COMPANY.name)} logo" />` : ''}
        <div>
          <h1>${escapeHtml(COMPANY.name)}</h1>
          <p>RC ${escapeHtml(COMPANY.rcNumber)} · ${escapeHtml(COMPANY.address)}</p>
          <p>${escapeHtml(COMPANY.phone)} · ${escapeHtml(COMPANY.email)}</p>
        </div>
      </div>
      <div class="doc">
        <h2>INVOICE</h2>
        <div class="number">${escapeHtml(invoice.invoice_number)}</div>
        <span class="pill ${status}">${escapeHtml(STATUS_LABELS[status])}</span>
      </div>
    </header>

    <section class="meta">
      <div class="block">
        <h3>Billed to</h3>
        <p class="name">${escapeHtml(invoice.client_name)}</p>
        ${invoice.client_address ? `<p>${escapeHtml(invoice.client_address)}</p>` : ''}
        ${invoice.client_email ? `<p>${escapeHtml(invoice.client_email)}</p>` : ''}
        ${invoice.client_phone ? `<p>${escapeHtml(invoice.client_phone)}</p>` : ''}
        ${invoice.property_title ? `<p style="margin-top:6px"><strong>Property:</strong> ${escapeHtml(invoice.property_title)}</p>` : ''}
      </div>
      <div class="block">
        <dl class="facts">
          <dt>Issue date</dt><dd>${formatDate(invoice.issue_date)}</dd>
          <dt>Due date</dt><dd>${formatDate(invoice.due_date)}</dd>
          <dt>Currency</dt><dd>NGN</dd>
        </dl>
      </div>
    </section>

    <table class="items">
      <thead>
        <tr>
          <th style="width:34px">#</th>
          <th>Description</th>
          <th class="num" style="width:70px">Qty</th>
          <th class="num" style="width:110px">Unit price</th>
          <th class="num" style="width:120px">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="summary">
      <table>
        <tr><td class="muted">Subtotal</td><td class="value">${formatNaira(invoice.subtotal, true)}</td></tr>
        ${invoice.discount > 0 ? `<tr><td class="muted">Discount</td><td class="value">− ${formatNaira(invoice.discount, true)}</td></tr>` : ''}
        ${invoice.tax_rate > 0 ? `<tr><td class="muted">VAT (${invoice.tax_rate}%)</td><td class="value">${formatNaira(invoice.tax_amount, true)}</td></tr>` : ''}
        <tr class="total"><td>Total</td><td class="value">${formatNaira(invoice.total, true)}</td></tr>
        ${invoice.amount_paid > 0 ? `<tr><td class="muted">Amount paid</td><td class="value">${formatNaira(invoice.amount_paid, true)}</td></tr>
        <tr class="balance"><td>Balance due</td><td class="value">${formatNaira(balance, true)}</td></tr>` : ''}
      </table>
    </div>

    <div class="words"><strong>Amount in words:</strong> ${escapeHtml(amountInWords(invoice.total))}</div>

    <section class="pay">
      <div class="card">
        <h3>Payment details</h3>
        ${bankLines || '<p class="muted">Bank details are issued with the payment request.</p>'}
        <p class="muted" style="margin-top:6px">Please quote ${escapeHtml(invoice.invoice_number)} as the transfer reference.</p>
      </div>
      <div class="card">
        <h3>Terms &amp; notes</h3>
        ${invoice.terms ? `<p>${escapeHtml(invoice.terms)}</p>` : '<p class="muted">Payment is due by the date shown above.</p>'}
        ${invoice.notes ? `<p style="margin-top:6px">${escapeHtml(invoice.notes)}</p>` : ''}
      </div>
    </section>

    <footer>
      <span>${escapeHtml(COMPANY.name)} · RC ${escapeHtml(COMPANY.rcNumber)}</span>
      <span>${escapeHtml(COMPANY.website)} · ${escapeHtml(COMPANY.email)} · ${escapeHtml(COMPANY.phone)}</span>
    </footer>
  </div>
</body>
</html>`;
}
