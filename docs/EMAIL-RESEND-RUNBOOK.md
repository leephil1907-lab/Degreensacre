# Transactional e-mail: Supabase → Resend

**Status:** the application code is already wired to Resend for product e-mail
(`src/lib/email.ts`). What is **not** configured is the *authentication* e-mail
that Supabase sends itself: sign-up confirmation, password reset, magic links and
security notifications. Those still leave through Supabase's shared built-in
mailer, and that mailer is throttled to **2 messages per hour** on this project.

## Why this matters right now

Verified against project `rvwirpfclysapqtnrlvx` on 2026-11-12:

| Setting | Value | Consequence |
| --- | --- | --- |
| `smtp_host` / `smtp_user` / `smtp_pass` | `null` | Built-in Supabase mailer is in use |
| `rate_limit_email_sent` | `2` per hour | The 3rd sign-up in an hour fails with `email rate limit exceeded` |
| `mailer_autoconfirm` | `false` | Every sign-up needs a confirmation e-mail — so the throttle **blocks registration entirely** |
| `site_url` | `https://degreensacre.onrender.com` | Confirmation / reset links point at the Render host, not the custom domain |

Real evidence captured during QA: a fresh sign-up produced

```
AUTH 400 /auth/v1/signup → {"code":"overloaded","message":"email rate limit exceeded"}
```

Users now see a human explanation ("We have sent too many e-mails in the last
hour… message us on WhatsApp"), but the flow is still broken until a real
mailer is connected. Connecting Resend fixes it permanently: custom SMTP raises
the ceiling to 30 messages/hour and lets the mail come from your own domain.

---

## Step 1 — Verify the domain at Resend (owner, ~15 minutes + DNS propagation)

1. Create an account at <https://resend.com> and add the domain you send from —
   recommended: **`degreenacres.org`** (use `mail.degreenacres.org` only if the
   root domain's DNS is locked to another provider).
2. Resend shows three records to add at your DNS host. Typical shape:

   | Type | Name | Value | Purpose |
   | --- | --- | --- | --- |
   | TXT | `resend._domainkey` | `p=MIGfMA0GCSq…` (long key) | DKIM signing |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF for the sending subdomain |
   | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) | Bounce/complaint feedback |

   > If a root `v=spf1` TXT record already exists for `degreenacres.org`, do **not**
   > create a second one — merge the include into the existing record.

3. Add a DMARC record so receivers trust the domain:

   ```
   _dmarc.degreenacres.org   TXT   "v=DMARC1; p=none; rua=mailto:dmarc@degreenacres.org; fo=1"
   ```

   Start with `p=none`, watch the reports for two weeks, then move to
   `p=quarantine`.

4. Click **Verify** in Resend. All three records must read *Verified* before
   Supabase will accept the credentials.
5. Create an API key (Resend → API Keys → *Sending access*). It starts with
   `re_`. Treat it as a password — never commit it.

## Step 2 — Point Supabase Auth at Resend (owner, 2 minutes)

Supabase Dashboard → **Project Settings → Authentication → SMTP Settings** →
*Enable custom SMTP*:

| Field | Value |
| --- | --- |
| Host | `smtp.resend.com` |
| Port | `465` (SSL) — use `587` if your network blocks 465 |
| Username | `resend` |
| Password | your Resend API key (`re_…`) |
| Sender e-mail | `no-reply@degreenacres.org` |
| Sender name | `De-Greenacres Properties Limited` |

Save. Supabase sends a test message; the rate limit for auth e-mail jumps from
2/hour to 30/hour automatically once custom SMTP is active.

## Step 3 — Application environment (owner, on Render)

Add these to the Render service, then redeploy:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM="De-Greenacres Properties <no-reply@degreenacres.org>"
EMAIL_REPLY_TO=support@degreenacres.org
EMAIL_NOTIFICATIONS_TO=degreenacrespropertieslimited@gmail.com
NEXT_PUBLIC_SITE_URL=https://degreenacres.org
```

`src/lib/email.ts` refuses to send in production unless `EMAIL_FROM` and
`EMAIL_REPLY_TO` are set — that guard is deliberate, keep it.

## Step 4 — Make auth links point at the live domain

When the custom domain is live, update:

- Supabase → Authentication → **URL Configuration**
  - Site URL: `https://degreenacres.org`
  - Redirect URLs: `https://degreenacres.org/**`, `https://www.degreenacres.org/**`, `https://degreensacre.onrender.com/**`, `http://localhost:3000/**`
- `NEXT_PUBLIC_SITE_URL` on Render (see above).

Confirm the value is currently
`site_url=https://degreensacre.onrender.com`,
`uri_allow_list=https://degreensacre.onrender.com/**,http://localhost:3000/**`.
The custom domain is **not** in that list yet, so confirmation and reset links
will bounce to the Render host even after SMTP is fixed.

## Step 5 — Brand the auth e-mails (optional, 10 minutes)

Supabase → Authentication → **Email Templates**. Paste the branded shell used by
`src/lib/email-events.tsx` (forest header with the logo, RC number in the footer)
into *Confirm signup*, *Reset password*, *Magic link* and *Change email*.

Keep `{{ .ConfirmationURL }}` exactly as written — it is the only token that
completes the flow.

## Step 6 — Prove it works

1. Resend → *Emails*: send a test message to yourself; shows *Delivered*.
2. Sign up on the site with a real inbox you control.
3. Open the message, choose **Show original**:
   - `spf=pass`, `dkim=pass`, `dmarc=pass`
   - `From:` ends in `@degreenacres.org`
4. Click the confirmation link → lands on `/signin?verified=confirmed` → sign in.
5. Use *Forgot password* → link arrives in under a minute → set a new password →
   sign in with it.
6. Send 5 sign-ups in ten minutes: no rate-limit error.

## Interim options if SMTP cannot be connected today

Pick one, and reverse it once Resend is live:

- **Raise the throttle** — Supabase → Authentication → Rate Limits →
  *Emails per hour* (Pro plan and above).
- **Temporarily auto-confirm** — turn on *Confirm email* off under
  Authentication → Providers → Email. Sign-ups then succeed instantly, but
  addresses are unverified until the mailer is connected. Not recommended for a
  property marketplace where verification badges matter.
- **Manual onboarding** — keep the throttle and have the WhatsApp line create
  accounts from the admin panel (Users → invite) for the first few customers.
