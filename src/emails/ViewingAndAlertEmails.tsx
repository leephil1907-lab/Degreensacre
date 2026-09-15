import React from 'react';
import EmailLayout from './EmailLayout';

/* ============================================ */
/* 1. VIEWING SCHEDULED (for buyers) */
/* ============================================ */
interface ViewingScheduledProps { name: string; propertyTitle: string; date: string; time: string; address: string; agentName: string; agentPhone?: string; }
export function ViewingScheduledEmail({ name, propertyTitle, date, time, address, agentName, agentPhone }: ViewingScheduledProps) {
  return (
    <EmailLayout previewText={`Your viewing for "${propertyTitle}" is confirmed`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Viewing Confirmed 📅
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Your property viewing has been scheduled. Here are the details:
      </p>
      <div style={{ backgroundColor: '#f0f7eb', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#2D5016', marginBottom: '16px' }}>📋 Viewing Details</div>
        <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>🏠 Property:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{propertyTitle}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📅 Date:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{date}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>🕐 Time:</td><td style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, paddingBottom: '10px' }}>{time}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666', paddingBottom: '10px' }}>📍 Address:</td><td style={{ fontSize: '13px', color: '#1A1A1A', paddingBottom: '10px' }}>{address}</td></tr>
          <tr><td style={{ fontSize: '13px', color: '#666' }}>👤 Agent:</td><td style={{ fontSize: '13px', color: '#1A1A1A' }}>{agentName} {agentPhone && `(${agentPhone})`}</td></tr>
        </table>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr><td align="center">
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`} style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            📍 Get Directions
          </a>
        </td></tr>
      </table>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        Need to reschedule? Contact us on WhatsApp or call +234 806 501 9971.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 2. VIEWING REMINDER (24hrs before) */
/* ============================================ */
interface ViewingReminderProps { name: string; propertyTitle: string; date: string; time: string; address: string; agentPhone?: string; }
export function ViewingReminderEmail({ name, propertyTitle, date, time, address, agentPhone }: ViewingReminderProps) {
  return (
    <EmailLayout previewText={`Reminder: Viewing tomorrow for "${propertyTitle}"`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Viewing Reminder ⏰
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        Just a friendly reminder — you have a property viewing coming up:
      </p>
      <div style={{ backgroundColor: '#fff8e1', borderLeft: '4px solid #f59e0b', padding: '20px', borderRadius: '0 8px 8px 0', marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#92400e', marginBottom: '12px' }}>⏰ Tomorrow</div>
        <div style={{ fontSize: '14px', color: '#1A1A1A', lineHeight: '1.8' }}>
          <strong>{propertyTitle}</strong><br />
          {date} at {time}<br />
          {address}
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: '24px' }}>
        <tr><td align="center">
          {agentPhone && <a href={`https://wa.me/${agentPhone.replace(/\D/g, '')}`} style={{ display: 'inline-block', backgroundColor: '#25D366', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            💬 Contact Agent
          </a>}
        </td></tr>
      </table>
      <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
        Can't make it? Please let us know at least 4 hours in advance so we can reschedule.
      </p>
    </EmailLayout>
  );
}

/* ============================================ */
/* 3. PRICE DROP ALERT */
/* ============================================ */
interface PriceDropProps { name: string; propertyTitle: string; propertyUrl: string; oldPrice: number; newPrice: number; location: string; image?: string; }
export function PriceDropEmail({ name, propertyTitle, propertyUrl, oldPrice, newPrice, location, image }: PriceDropProps) {
  const savings = oldPrice - newPrice;
  const percentage = Math.round((savings / oldPrice) * 100);
  return (
    <EmailLayout previewText={`Price drop! "${propertyTitle}" is now ₦${(newPrice/1000000).toFixed(0)}M`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        Price Drop Alert! 📉
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        A property you saved has dropped in price:
      </p>
      {image && <img src={image} alt={propertyTitle} width="100%" style={{ borderRadius: '8px', marginBottom: '16px' }} />}
      <div style={{ backgroundColor: '#f0f7eb', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px' }}>{propertyTitle}</div>
        <div style={{ fontSize: '13px', color: '#666', marginBottom: '12px' }}>📍 {location}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>₦{oldPrice.toLocaleString()}</span>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#2D5016' }}>₦{newPrice.toLocaleString()}</span>
        </div>
        <div style={{ marginTop: '8px', display: 'inline-block', backgroundColor: '#C41E7A', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
          Save ₦{savings.toLocaleString()} ({percentage}% off)
        </div>
      </div>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0}>
        <tr><td align="center">
          <a href={propertyUrl} style={{ display: 'inline-block', backgroundColor: '#C41E7A', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            View Property Now
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}

/* ============================================ */
/* 4. NEW PROPERTY MATCH ALERT */
/* ============================================ */
interface NewPropertyAlertProps { name: string; properties: Array<{ title: string; price: number; location: string; url: string; image?: string }>; }
export function NewPropertyAlertEmail({ name, properties }: NewPropertyAlertProps) {
  return (
    <EmailLayout previewText={`${properties.length} new properties match your criteria`}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A1A', marginBottom: '8px', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        New Properties for You 🏠
      </h1>
      <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.6', marginBottom: '24px' }}>Hi {name},</p>
      <p style={{ fontSize: '15px', color: '#1A1A1A', lineHeight: '1.7', marginBottom: '24px' }}>
        <strong>{properties.length} new {properties.length === 1 ? 'property matches' : 'properties match'}</strong> your search criteria:
      </p>
      {properties.map((property, i) => (
        <div key={i} style={{ border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>{property.title}</div>
          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>📍 {property.location}</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#2D5016' }}>₦{property.price.toLocaleString()}</div>
          <a href={property.url} style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', color: '#C41E7A', fontWeight: 600, textDecoration: 'none' }}>View Details →</a>
        </div>
      ))}
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: '24px' }}>
        <tr><td align="center">
          <a href="https://degreenacres.com/properties" style={{ display: 'inline-block', backgroundColor: '#2D5016', color: '#ffffff', padding: '14px 40px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }}>
            Browse All Properties
          </a>
        </td></tr>
      </table>
    </EmailLayout>
  );
}
