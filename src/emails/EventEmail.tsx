import React from 'react';
import EmailLayout from './EmailLayout';
import { EMAIL_BRAND as brand, emailUrl } from './brand';
import { EMAIL_EVENTS, type EmailEvent, type EventEmailData } from './events';

export default function EventEmail({ event, data = {} }: { event: EmailEvent; data?: EventEmailData }) {
  const definition = EMAIL_EVENTS[event];
  const details = Object.entries(data.details || {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
  const href = emailUrl(data.actionPath || definition.path);
  return <EmailLayout previewText={`${definition.subject} — ${definition.body.slice(0, 120)}`}>
    <p style={{ margin: '0 0 14px', color: brand.muted, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{definition.category}</p>
    <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: '38px', fontWeight: 400, margin: '0 0 22px', color: '#253e31' }}>{data.subject || definition.title}</h1>
    <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: '25px' }}>Hello{data.name ? ` ${data.name}` : ''},</p>
    <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: '26px', color: '#495b50' }}>{definition.body}</p>
    {details.length > 0 && <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ border: '1px solid #dce5df', borderRadius: 10, margin: '0 0 24px', backgroundColor: '#f7faf8', tableLayout: 'fixed' }}><tbody>{details.map(([label, value]) => <tr key={label}><td valign="top" style={{ width: '35%', padding: '12px', fontSize: 12, lineHeight: '20px', color: '#52675a', overflowWrap: 'anywhere' }}>{label}</td><td valign="top" style={{ padding: '12px', fontSize: 13, lineHeight: '20px', fontWeight: 600, color: '#253e31', overflowWrap: 'anywhere' }}>{String(value)}</td></tr>)}</tbody></table>}
    {data.message && <div style={{ margin: '0 0 24px', borderLeft: `3px solid ${brand.green}`, padding: '4px 0 4px 16px' }}>{data.message.split(/\n\n+/).map((paragraph, index) => <p key={index} style={{ margin: '0 0 12px', fontSize: 15, lineHeight: '26px', whiteSpace: 'pre-line', color: '#495b50' }}>{paragraph}</p>)}</div>}
    <table role="presentation" cellPadding={0} cellSpacing={0} style={{ marginBottom: 22 }}><tbody><tr><td  style={{ backgroundColor: brand.green, borderRadius: 8, textAlign: 'center' }}><a href={href} style={{ display: 'inline-block', padding: '15px 24px', backgroundColor: brand.green, border: `1px solid ${brand.green}`, borderRadius: 8, color: '#ffffff', fontSize: 14, lineHeight: '20px', fontWeight: 700, textDecoration: 'none' }}>{definition.action} →</a></td></tr></tbody></table>
    <p style={{ fontSize: 12, lineHeight: '20px', color: '#627569', margin: '0 0 24px' }}>Button not working? <a href={href} style={{ color: brand.green, overflowWrap: 'anywhere' }}>Open this page on De-Greenacres</a>.</p>
    <p style={{ margin: 0, fontSize: 14, lineHeight: '24px', color: '#495b50' }}>Here to help you find, verify and own.<br /><strong>The De-Greenacres team</strong></p>
  </EmailLayout>;
}
