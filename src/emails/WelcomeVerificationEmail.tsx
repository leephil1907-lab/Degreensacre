import React from 'react';
import EmailLayout from './EmailLayout';

interface Props {
  name: string;
  verificationUrl: string;
}

export default function WelcomeVerificationEmail({ name, verificationUrl }: Props) {
  return (
    <EmailLayout previewText="Verify your De-Greenacres account to start exploring properties">
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Welcome to De-Greenacres! 🎉
      </h1>
      <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.6', marginBottom: '24px' }}>
        Hi {name},
      </p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Thank you for joining Nigeria's trusted property intelligence platform. To get started, please verify your email address by clicking the button below:
      </p>

      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr>
          <td align="center">
            <a href={verificationUrl} style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 12px rgba(45, 80, 22, 0.2)' }}>
              Verify Email Address
            </a>
          </td>
        </tr>
      </table>

      <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.6', marginBottom: '24px' }}>
        Or copy and paste this link into your browser:<br />
        <a href={verificationUrl} style={{ color: '#2D5016', fontSize: '12px', wordBreak: 'break-all' }}>{verificationUrl}</a>
      </p>

      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#2D5016', marginBottom: '8px' }}>
          What's next?
        </div>
        <div style={{ fontSize: '13px', color: '#555555', lineHeight: '1.8' }}>
          ✓ Browse verified properties across Nigeria<br />
          ✓ Save favorites and set up alerts<br />
          ✓ Use investment calculators<br />
          ✓ Schedule property viewings via WhatsApp
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#999999', lineHeight: '1.6' }}>
        This link expires in 24 hours. If you didn't create this account, you can safely ignore this email.
      </p>
    </EmailLayout>
  );
}
