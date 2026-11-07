import React from 'react';
import { render, toPlainText } from '@react-email/render';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import EmailLayout from '../src/emails/EmailLayout';
import EventEmail from '../src/emails/EventEmail';
import { EMAIL_EVENTS, type EmailEvent } from '../src/emails/events';
import { emailUrl } from '../src/emails/brand';

async function main() {
  const root = 'email-deliverables';
  await mkdir(`${root}/events`, { recursive: true });
  await mkdir(`${root}/supabase-auth`, { recursive: true });
  const logo = `data:image/png;base64,${(await readFile('public/logo-icon.png')).toString('base64')}`;
  const cards: string[] = [];
  for (const event of Object.keys(EMAIL_EVENTS) as EmailEvent[]) {
    const html = await render(<EventEmail event={event} />);
    assert(html.includes('/logo-icon.png'));
    assert(html.includes('De-Greenacres Properties Limited'));
    assert(!html.includes('https://degreenacres.com'));
    assert(!html.includes('fonts.googleapis.com'));
    assert(toPlainText(html).includes('De-Greenacres'));
    await writeFile(`${root}/events/${event}.html`, html);
    await writeFile(`${root}/events/${event}.txt`, toPlainText(html));
    const preview = html.replaceAll(emailUrl('/logo-icon.png'), logo);
    const escaped = preview.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    cards.push(`<article data-search="${event} ${EMAIL_EVENTS[event].subject.toLowerCase()}"><h2>${EMAIL_EVENTS[event].subject}</h2><p class="meta">${event} · ${EMAIL_EVENTS[event].mode}</p><iframe title="${EMAIL_EVENTS[event].subject}" sandbox srcdoc="${escaped}"></iframe></article>`);
  }
  // The auth provider supplies the real one-time token or signed confirmation URL.
  const authTypes = { confirmation: 'auth_confirmation', recovery: 'auth_recovery', magic_link: 'auth_magic_link', invite: 'auth_invitation', email_change: 'auth_email_change', reauthentication: 'auth_reauthentication' } as const;
  for (const [name, key] of Object.entries(authTypes)) {
    const d = EMAIL_EVENTS[key];
    const secureLink = name === 'reauthentication' ? null : '__PROVIDER_CONFIRMATION_URL__';
    const html = await render(<EmailLayout previewText={d.subject}>
      <p style={{ fontSize: 11, letterSpacing: 2, color: '#526e50' }}>ACCOUNT SECURITY</p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 30, lineHeight: '38px', fontWeight: 400, color: '#253e31' }}>{d.title}</h1>
      <p style={{ fontSize: 15, lineHeight: '26px', color: '#495b50' }}>{d.body}</p>
      {secureLink ? <><p style={{ margin: '28px 0' }}><a href={secureLink} style={{ display: 'inline-block', backgroundColor: '#315c49', color: '#ffffff', padding: '16px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>{d.action}</a></p><p style={{ fontSize: 12, lineHeight: '22px', color: '#526e50' }}>If the button does not work, copy this link into your browser:<br /><a href={secureLink} style={{ color: '#315c49', wordBreak: 'break-all' }}>{secureLink}</a></p></> : <p style={{ fontSize: 30, letterSpacing: 6, backgroundColor: '#f2f7f4', padding: 20 }}>__PROVIDER_TOKEN__</p>}
      <p style={{ fontSize: 12, lineHeight: '22px', color: '#526e50' }}>This security action expires according to the account security settings. If you did not request it, do not use this link or code. Contact support if you suspect unauthorised activity.</p>
    </EmailLayout>);
    const template = html.replaceAll('__PROVIDER_CONFIRMATION_URL__', '{{ .ConfirmationURL }}').replaceAll('__PROVIDER_TOKEN__', '{{ .Token }}');
    assert(template.includes(secureLink ? '{{ .ConfirmationURL }}' : '{{ .Token }}'));
    await writeFile(`${root}/supabase-auth/${name}.html`, template);
  }
  const escaped = await render(<EventEmail event="contact_received" data={{ name: '<script>alert(1)</script>', message: '<img src=x onerror=alert(1)>', actionPath: 'https://evil.example/steal' }} />);
  assert(!escaped.includes('<script>')); assert(!escaped.includes('<img src=x')); assert(!escaped.includes('evil.example'));
  assert.equal(emailUrl('javascript:alert(1)'), emailUrl('/').replace(/\/$/, ''));
  await writeFile(`${root}/preview.html`, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>De-Greenacres — Email Design Library</title><style>*{box-sizing:border-box}body{margin:0;background:#f2f6f3;color:#253e31;font:15px Arial,sans-serif}header{padding:48px 24px;background:#315c49;color:white}header div,main{max-width:1280px;margin:auto}h1{font:42px Georgia,serif;margin:12px 0}header p{max-width:760px;line-height:1.8;color:#e1eee6}.badge{font-size:11px;letter-spacing:2px}main{padding:24px}input{padding:16px;width:100%;border:1px solid #dce5df;border-radius:12px;font-size:16px;margin-bottom:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr));gap:24px}article{background:white;border:1px solid #dce5df;border-radius:16px;padding:18px;min-width:0}article h2{font-size:16px;line-height:1.5;margin:0}.meta{font-size:11px;color:#526e50;line-height:1.6}iframe{border:0;width:100%;height:920px;background:#f2f6f3;border-radius:10px}</style></head><body><header><div><span class="badge">DE-GREENACRES · COMMUNICATION DESIGN</span><h1>One brand. Every important moment.</h1><p>${Object.keys(EMAIL_EVENTS).length} branded event templates plus six ready-to-install Supabase authentication templates. This is a design library, not a record of actual customer events. Templates marked conditional or marketing are not automatically sent. No email is sent from this page.</p></div></header><main><label for="search">Find an email event</label><input id="search" placeholder="Search accounts, listings, inspections, reviews…"><div class="grid">${cards.join('')}</div></main><script>document.querySelector('#search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('article').forEach(a=>a.hidden=!a.dataset.search.includes(q))})</script></body></html>`);
  console.log(`EMAIL_RENDER_PASS ${Object.keys(EMAIL_EVENTS).length} events; 6 provider templates; plaintext; escaping; trusted navigation`);
}
main().catch(error => { console.error(error); process.exit(1); });
