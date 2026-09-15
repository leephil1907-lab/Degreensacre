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
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#FAF9F6', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}>
        {previewText && (
          <div style={{ display: 'none', maxHeight: '0', overflow: 'hidden', opacity: 0 }}>
            {previewText}
          </div>
        )}

        {/* Outer wrapper */}
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#FAF9F6' }}>
          <tr>
            <td align="center" style={{ padding: '20px 16px' }}>

              {/* Email container */}
              <table role="presentation" width="600" cellPadding={0} cellSpacing={0} style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

                {/* Header with green gradient */}
                <tr>
                  <td style={{ background: 'linear-gradient(135deg, #2D5016 0%, #3a6b1e 100%)', padding: '32px 40px', textAlign: 'center' as const }}>
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center">
                          <img
                            src="https://degreenacres.com/logo-icon.png"
                            alt="De-Greenacres"
                            width={56}
                            height={56}
                            style={{ display: 'block', borderRadius: '8px' }}
                          />
                          <div style={{ height: '12px' }} />
                          <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: '-0.3px' }}>
                            De-Greenacres
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, marginTop: '2px' }}>
                            Properties Limited
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
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
                    <div style={{ borderTop: '1px solid #E8E8E8' }} />
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ padding: '32px 40px', textAlign: 'center' as const }}>
                    {/* Contact info */}
                    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center" style={{ paddingBottom: '16px' }}>
                          <div style={{ fontSize: '13px', color: '#666666', lineHeight: '1.6' }}>
                            <span style={{ fontWeight: 600, color: '#1A1A1A' }}>RC: 1856064</span> &nbsp;·&nbsp; CAC Registered
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style={{ paddingBottom: '16px' }}>
                          <div style={{ fontSize: '12px', color: '#999999', lineHeight: '1.6' }}>
                            📞 +234 806 501 9971 &nbsp;·&nbsp; ✉️ de_greenacrespropertiesltd@yahoo.com
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style={{ paddingBottom: '16px' }}>
                          <a href="https://wa.me/2348065019971" style={{ display: 'inline-block', backgroundColor: '#25D366', color: '#ffffff', padding: '8px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                            💬 Chat on WhatsApp
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center">
                          <div style={{ fontSize: '11px', color: '#bbbbbb', lineHeight: '1.6' }}>
                            © {new Date().getFullYear()} De-Greenacres Properties Limited. All rights reserved.
                            <br />
                            <a href="https://degreenacres.com" style={{ color: '#2D5016', textDecoration: 'none' }}>Visit Website</a>
                            &nbsp;·&nbsp;
                            <a href="https://degreenacres.com/privacy" style={{ color: '#999999', textDecoration: 'none' }}>Privacy Policy</a>
                            &nbsp;·&nbsp;
                            <a href="https://degreenacres.com/terms" style={{ color: '#999999', textDecoration: 'none' }}>Terms of Service</a>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {/* Anti-spam notice */}
              <div style={{ marginTop: '16px', fontSize: '10px', color: '#cccccc', textAlign: 'center' as const }}>
                You received this email because you have an account with De-Greenacres Properties Limited.
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
