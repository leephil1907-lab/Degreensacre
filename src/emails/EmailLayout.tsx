import React from 'react';
import { EMAIL_BRAND as brand, emailUrl } from './brand';

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
}

/** Table-based, inline-styled layout: readable without images or external fonts. */
export default function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="color-scheme" content="light" /><title>{brand.legalName}</title></head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f2f6f3', color: '#25352d', fontFamily: 'Arial, Helvetica, sans-serif', WebkitTextSizeAdjust: '100%' }}>
        <div style={{ display: 'none', maxHeight: 0, overflow: 'hidden', opacity: 0 }}>{previewText}</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f2f6f3' }}><tbody><tr><td align="center" style={{ padding: '28px 12px' }}>
          <table role="presentation" width="600" cellPadding={0} cellSpacing={0} style={{ width: '100%', maxWidth: 600, backgroundColor: '#ffffff', border: '1px solid #dce5df', borderRadius: 16 }}><tbody>
            <tr><td style={{ padding: '28px 24px', backgroundColor: brand.green, borderRadius: '16px 16px 0 0' }}>
              <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}><tbody><tr>
                <td width="70" valign="middle"><a href={emailUrl('/')}><img src={emailUrl('/logo-icon.png')} width="56" height="56" alt="De-Greenacres logo" style={{ display: 'block', backgroundColor: '#ffffff', borderRadius: 10, border: '4px solid #ffffff', objectFit: 'contain' }} /></a></td>
                <td valign="middle"><p style={{ color: '#ffffff', margin: 0, fontSize: 25, fontFamily: 'Georgia, serif' }}>De-Greenacres</p><p style={{ color: '#e1eee6', margin: '6px 0 0', fontSize: 10, letterSpacing: 2 }}>PROPERTIES LIMITED</p></td>
              </tr></tbody></table>
            </td></tr>
            <tr><td style={{ height: 4, backgroundColor: '#b6ccba', fontSize: 1, lineHeight: '4px' }}>&nbsp;</td></tr>
            <tr><td style={{ padding: '32px 24px', overflowWrap: 'anywhere' }}>{children}</td></tr>
            <tr><td style={{ padding: '24px', backgroundColor: '#f8faf8', borderTop: '1px solid #e4eee7', borderRadius: '0 0 16px 16px' }}>
              <p style={{ margin: '0 0 10px', color: brand.green, fontSize: 13, fontWeight: 700 }}>{brand.legalName}</p>
              <p style={{ margin: '0 0 14px', color: '#53665a', fontSize: 12, lineHeight: '20px' }}>{brand.registration} · CAC Registered<br />Find property. Verify the opportunity. Own with confidence.</p>
              <p style={{ margin: '0 0 14px', fontSize: 12, lineHeight: '24px' }}><a href={`mailto:${brand.supportEmail}`} style={{ color: brand.green }}>{brand.supportEmail}</a><br /><a href={`tel:${brand.phone}`} style={{ color: brand.green }}>{brand.phone}</a> · <a href={`https://wa.me/${brand.whatsapp}`} style={{ color: brand.green }}>WhatsApp support</a></p>
              <p style={{ margin: 0, fontSize: 12, lineHeight: '22px' }}><a href={emailUrl('/')} style={{ color: brand.green }}>Visit website</a> &nbsp;·&nbsp; <a href={emailUrl('/privacy')} style={{ color: brand.green }}>Privacy</a> &nbsp;·&nbsp; <a href={emailUrl('/contact')} style={{ color: brand.green }}>Contact us</a></p>
            </td></tr>
          </tbody></table>
          <p style={{ maxWidth: 560, margin: '18px auto 0', fontSize: 11, lineHeight: '18px', color: '#627569' }}>This service email relates to an account action, request or conversation on De-Greenacres. We will never ask for your password or one-time security code by email. Verify property details and payment instructions with our team before paying.</p>
          <p style={{ margin: '10px 0 0', fontSize: 11, color: '#627569' }}>© {new Date().getFullYear()} {brand.legalName}</p>
        </td></tr></tbody></table>
      </body>
    </html>
  );
}
