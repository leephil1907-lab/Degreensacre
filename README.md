# De-Greenacres Properties

Real estate marketplace for Nigeria — verified listings, enquiry and inspection workflows, a full admin console, and branded PDF invoicing with payment tracking.

**Live:** <https://degreensacre.onrender.com> · **Owner:** De-Greenacres Properties Limited (RC: 1856064)

---

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Postgres, Auth, Storage, RLS) · Resend · Leaflet/OpenStreetMap · `pdf-lib`

## Quick start

```bash
git clone https://github.com/leephil1907-lab/Degreensacre.git
cd Degreensacre
npm ci
cp .env.example .env.local     # then fill in the Supabase + Resend values
npm run dev                    # http://localhost:3000
```

Requires Node 22 (`.nvmrc`).

**Database:** on a fresh project run `supabase-schema.sql` in the Supabase SQL editor, then `supabase-production-cms-migration.sql`. Later changes live in `docs/migrations/`. New listings start as `pending_review`; nothing is seeded by the migrations.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run validate` | Type-check + lint + build (same gate as CI) |

## Features

- **Marketplace** — properties, land, developments and short lets; filtering by state, area, type, price and bedrooms; map view; save/bookmark.
- **Trust** — every owner/agent submission enters `pending_review`; only admins publish or verify; honest verification labels; CAC details on every page.
- **Customer dashboard** — saved properties, enquiries, viewings, listings, invoices, search alerts, notifications, profile and password settings.
- **Invoices** — branded PDF/HTML/CSV with numbering `INV-YYYY-NNNN`, VAT, a real payments ledger, ageing buckets and customer self-service downloads.
- **Search alerts** — customers save a search and are e-mailed when a matching listing is published (instant, plus daily/weekly digests).
- **Admin console** — properties, content manager, users, enquiries, contact inbox, reviews, e-mail centre and templates, invoices, site settings, audit trail.
- **E-mail** — Resend templates for transactional events; see [EMAIL_SYSTEM.md](./EMAIL_SYSTEM.md).
- **Nigerian specifics** — C of O / Governor's Consent / Deed of Assignment, state and LGA coverage, naira formatting, WhatsApp contact.

## Structure

```
src/
├── app/          # routes: public pages, dashboard, admin, api/
├── components/   # UI and admin components
├── contexts/     # Auth context
├── emails/       # React Email templates
└── lib/          # Supabase clients, validation, invoices, search matching
docs/migrations/  # SQL applied after the base schema
```

## Configuration

All variables are documented in `.env.example`. The essentials: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`.

## Deploy

Render Blueprint (`render.yaml`) runs `npm ci && npm run build` then `npm start`, with a health check at `/api/health`. Step-by-step setup, Supabase auth URLs and custom-domain cutover: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

## Security

Row Level Security on every table, server-side admin authorization, input validation and upload checks on all API routes, parameterised queries, and no service-role key in the application path.

## Docs

[Deployment](./RENDER_DEPLOYMENT.md) · [E-mail system](./EMAIL_SYSTEM.md) · [Resend/SMTP runbook](./docs/EMAIL-RESEND-RUNBOOK.md) · [Production audit](./PRODUCTION-AUDIT-2026-11-12.md)

## License

Proprietary — De-Greenacres Properties Limited. All rights reserved.
