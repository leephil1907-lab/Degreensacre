import React from 'react';

interface EmailLayoutProps {
  previewText?: string;
  children: React.ReactNode;
}

export default function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>De-Greenacres Properties</title>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f5f5f0', fontFamily: "'Manrope', 'Segoe UI', Arial, sans-serif" }}>
        {previewText && (
          <div style={{ display: 'none', maxHeight: '0', overflow: 'hidden', opacity: 0 }}>
            {previewText}
          </div>
        )}

        {/* Outer wrapper */}
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#f5f5f0' }}>
          <tr>
            <td align="center" style={{ padding: '24px 16px' }}>

              {/* Email container */}
              <table role="presentation" width="600" cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>

                {/* Header with forest gradient */}
                <tr>
                  <td style={{ background: 'linear-gradient(135deg, #283818 0%, #2D5016 50%, #3a6b1e 100%)', padding: '36px 40px', textAlign: 'center' as const }}>
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center">
                          <img
                            src="https://degreenacres.com/logo-icon.png"
                            alt="De-Greenacres"
                            width={52}
                            height={52}
                            style={{ display: 'block', borderRadius: '10px' }}
                          />
                          <div style={{ height: '14px' }} />
                          <div style={{ color: '#ffffff', fontSize: '22px', fontWeight: 400, fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: '-0.3px' }}>
                            De-Greenacres
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' as const, marginTop: '4px' }}>
                            Properties Limited
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Sage accent bar */}
                <tr>
                  <td style={{ height: '3px', background: 'linear-gradient(90deg, #788848, #b8b898, #788848)' }} />
                </tr>

                {/* Body content */}
                <tr>
                  <td style={{ padding: '40px' }}>
                    {children}
                  </td>
                </tr>

                {/* Divider */}
                <tr>
                  <td style={{ padding: '0 40px' }}>
                    <div style={{ borderTop: '1px solid #e8e8d8' }} />
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: '32px 40px', textAlign: 'center' as const }}>
                    {/* CAC Badge */}
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center" style={{ paddingBottom: '12px' }}>
                          <div style={{ display: 'inline-block', backgroundColor: '#f0f0e8', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#283818', fontWeight: 600 }}>
                            🛡️ RC: 1856064 · CAC Registered
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style={{ paddingBottom: '16px' }}>
                          <div style={{ fontSize: '12px', color: '#888888', lineHeight: '1.8' }}>
                            📞 +234 806 501 9971 &nbsp;·&nbsp; ✉️ degreenacrespropertieslimited@gmail.com
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style={{ paddingBottom: '16px' }}>
                          <a href="https://wa.me/2347041754800?text=Hello%20De-Greenacres%2C%20I%20received%20your%20email%20and%20would%20like%20to%20enquire%20further." style={{ display: 'inline-block', backgroundColor: '#25D366', color: '#ffffff', padding: '10px 24px', borderRadius: '24px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', fontFamily: "'Manrope', sans-serif" }}>
                            💬 Chat on WhatsApp
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style={{ fontSize: '11px', color: '#bbbbbb', lineHeight: '1.8' }}>
                            © {new Date().getFullYear()} De-Greenacres Properties Limited. All rights reserved.
                            <br />
                            <a href="https://degreenacres.com" style={{ color: '#283818', textDecoration: 'none', fontWeight: 600 }}>Visit Website</a>
                            &nbsp;·&nbsp;
                            <a href="https://degreenacres.com/privacy" style={{ color: '#999999', textDecoration: 'none' }}>Privacy</a>
                            &nbsp;·&nbsp;
                            <a href="https://degreenacres.com/terms" style={{ color: '#999999', textDecoration: 'none' }}>Terms</a>
                            &nbsp;·&nbsp;
                            <a href="https://degreenacres.com/book-inspection" style={{ color: '#283818', textDecoration: 'none', fontWeight: 600 }}>Book Inspection</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {/* Anti-spam notice */}
              <div style={{ marginTop: '16px', fontSize: '10px', color: '#cccccc', textAlign: 'center' as const }}>
                You received this email because you have an account or enquiry with De-Greenacres Properties Limited.
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
