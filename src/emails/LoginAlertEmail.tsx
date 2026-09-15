import React from 'react';
import EmailLayout from './EmailLayout';

interface Props { name: string; newDevice?: string; location?: string; time?: string; }
export default function LoginAlertEmail({ name, newDevice = 'Unknown device', location = 'Unknown', time = new Date().toLocaleString() }: Props) {
  return (
    <EmailLayout previewText="New sign-in detected on your De-Greenacres account">
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        New Sign-In Detected
      </h1>
      <p style={{ fontSize: '15px', color: '#666666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        We noticed a new sign-in to your account. If this was you, no action is needed.
      </p>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>📱 <strong>Device:</strong></td><td style={{ fontSize: '13px', color: '#1A1A1A', paddingBottom: '8px' }}>{newDevice}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>📍 <strong>Location:</strong></td><td style={{ fontSize: '13px', color: '#1A1A1A', paddingBottom: '8px' }}>{location}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '8px' }}>🕐 <strong>Time:</strong></td><td style={{ fontSize: '13px', color: '#1A1A1A', paddingBottom: '8px' }}>{time}</td></tr>
        </table>
      </div>
      <div style={{ backgroundColor: '#fff0f0', borderLeft: '4px solid #ef4444', padding: '16px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: '1.6' }}>
          <strong>Wasn't you?</strong> Please change your password immediately and contact us at +234 806 501 9971.
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href="https://degreenacres.com/dashboard/settings" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Secure My Account
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}
