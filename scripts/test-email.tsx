import React from 'react';
import assert from 'node:assert/strict';
import { render } from '@react-email/render';
import EventEmail from '../src/emails/EventEmail';
import { sendEmail, sendBulkEmail, scheduleEmail } from '../src/lib/email';

async function main() {
  const originalFetch = globalThis.fetch;
  const saved = { key: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM, reply: process.env.EMAIL_REPLY_TO };
  const envelopes: Array<{ headers: Headers; body: Record<string, unknown> }> = [];
  try {
    delete process.env.RESEND_API_KEY;
    const template = <EventEmail event="inspection_requested" />;
    assert.equal((await sendEmail({ to: 'test@example.com', subject: 'Test', template })).success, false);
    process.env.RESEND_API_KEY = 're_test_not_a_real_key';
    process.env.EMAIL_FROM = 'De-Greenacres <sender@example.com>';
    process.env.EMAIL_REPLY_TO = 'support@example.com';
    globalThis.fetch = async (_input, options) => {
      envelopes.push({ headers: new Headers(options?.headers), body: JSON.parse(String(options?.body)) });
      return new Response(JSON.stringify({ id: 'isolated-test-message' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    };
    const result = await sendEmail({ to: 'test@example.com', subject: 'Inspection requested', template, idempotencyKey: 'test-event-1' });
    assert.equal(result.success, true);
    assert.equal(envelopes[0].headers.get('Idempotency-Key'), 'test-event-1');
    assert(String(envelopes[0].body.html).includes('/logo-icon.png'));
    assert(String(envelopes[0].body.text).includes('not yet confirmed'));
    assert.deepEqual(envelopes[0].body.to, ['test@example.com']);
    assert.equal(envelopes[0].body.reply_to, 'support@example.com');
    assert.equal((await sendEmail({ to: 'not-an-email', subject: 'x', template })).success, false);
    assert.equal((await sendEmail({ to: 'test@example.com', subject: 'Subject\r\nBcc:bad@example.com', template })).success, false);
    await sendBulkEmail({ recipients: ['one@example.com','two@example.com','one@example.com'], subject: 'Private', template });
    assert.equal(envelopes.length, 3); // One original send, two distinct bulk envelopes.
    assert.deepEqual(envelopes[1].body.to, ['one@example.com']);
    assert.deepEqual(envelopes[2].body.to, ['two@example.com']);
    assert.equal((await scheduleEmail({ to:'test@example.com', subject:'x', template, scheduledAt:new Date(0) })).success, false);
    globalThis.fetch = async () => new Response(JSON.stringify({ name:'validation_error', message:'Rejected' }), { status:422, headers:{'Content-Type':'application/json'} });
    assert.equal((await sendEmail({to:'test@example.com',subject:'Reject',template})).success, false);
    const html = await render(<EventEmail event="contact_received" data={{name:'<script>unsafe</script>',message:'<img src=x>',actionPath:'//attacker.example'}} />);
    assert(!html.includes('<script>')); assert(!html.includes('<img src=x>')); assert(!html.includes('attacker.example'));
    console.log('EMAIL_SEND_PASS configuration gate, HTML/text, branding, idempotency, recipient isolation, header validation, scheduling and provider rejection');
  } finally {
    globalThis.fetch = originalFetch;
    for (const [name,value] of Object.entries({RESEND_API_KEY:saved.key,EMAIL_FROM:saved.from,EMAIL_REPLY_TO:saved.reply})) { if(value===undefined) delete process.env[name]; else process.env[name]=value; }
  }
}
main().catch(error=>{console.error(error);process.exit(1)});
