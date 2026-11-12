# Production readiness — audit and remediation

**Date:** 12 November 2026
**Scope:** Repository `leephil1907-lab/Degreensacre` at `dd5509d`, plus the live Supabase project `Degreensacre` (`rvwirpfclysapqtnrlvx`, eu-west-1).
**Verdict:** the application now builds, starts and enforces its security boundary from a clean environment. It is **deployable today**; the remaining blockers are owner-side account operations (section 5), not code.

---

## 1. What was verified (green)

| Check | Command / probe | Result |
| --- | --- | --- |
| Clean install | `npm ci` | ✅ 428 packages, no errors |
| TypeScript | `npm run type-check` | ✅ no errors |
| ESLint | `npx eslint .` | ✅ 0 errors (237 warnings: legacy `any`, unused imports, `<img>` usage) |
| Production build | `npm run build` | ✅ compiles, type-checks, prerenders 83 routes |
| Build **without** env vars | `npm run build` with Supabase vars unset | ✅ passes (was a hard failure — see 2.1) |
| Production server | `next start` + 14-route smoke test | ✅ `/`, `/properties`, property detail, `/contact`, `/insights`, `/agencies`, `/developments`, `/signin`, `/sitemap.xml`, `/robots.txt` → 200; `/admin`, `/dashboard` → 307 to `/signin`; unknown URL → branded 404 |
| Health check | `GET /api/health` | ✅ 200 `{"status":"ok"}`, `no-store` |
| Security headers | `HEAD /` | ✅ CSP, `X-Frame-Options: DENY`, HSTS, `Referrer-Policy`, `nosniff`, `Permissions-Policy` |
| Dependency audit | `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| RLS coverage | `pg_class` / `pg_policy` on live DB | ✅ row-level security enabled on all 31 public tables |
| Anon boundary probes | PostgREST calls with the public anon key | ✅ after remediation: `verification_records` → 401; forged `contact_requests` → 401; published `properties` → 200 |

## 2. Defects fixed in this pass

### 2.1 Build failed without Supabase credentials — **deploy blocker**

`src/lib/supabase.ts` constructed the browser client at module scope. During `next build`, prerendering `/_not-found` imported that module and threw:

```
@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
```

Any deploy where the build step did not see both public keys (first deploy, secret rotation typo, CI, preview environment) failed outright. The client is now created lazily behind a memoised `getSupabaseBrowserClient()`, with `supabase` kept as a proxy export so all existing call sites are unchanged. Configuration problems now surface as a clear runtime error instead of a broken pipeline.

### 2.2 No startup configuration validation

Added `src/instrumentation.ts`. On boot the server logs missing **required** variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) at error level and missing **recommended** ones (`NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFICATIONS_TO`) at warn level, plus a warning when `NEXT_PUBLIC_SITE_URL` is not HTTPS in production. Verified in the server log of this run.

### 2.3 No Content-Security-Policy

`next.config.js` had every security header except CSP. A policy is now emitted for all routes, allow-listing only the hosts the app actually uses: Supabase (REST + Realtime), OpenStreetMap tiles and embeds, cdnjs (Leaflet marker sprites), Google Analytics/AdSense (inert unless configured), and the tour-embed hosts. `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`.

Known limitation: `script-src` retains `'unsafe-inline'` because Next.js emits inline bootstrap/JSON-LD scripts. Moving to a nonce-based policy belongs in `src/proxy.ts` and needs full-page QA.

### 2.4 No error boundaries or 404 page

Unhandled render/data errors fell through to the framework's bare error page, and unknown URLs had no branded destination. Added:

- `src/app/error.tsx` — route-level boundary with retry, error digest surfaced for log correlation.
- `src/app/global-error.tsx` — last-resort boundary (root layout failure) with inline styling so it cannot itself fail to style.
- `src/app/not-found.tsx` — branded 404 with recovery links, `noindex`.

### 2.5 No CI

Added `.github/workflows/ci.yml`: `npm ci` → `tsc --noEmit` → ESLint → production build with placeholder credentials → `npm audit --omit=dev --audit-level=high`, on every push and PR to `main`. This makes 2.1 permanently regression-proof.

### 2.6 Database hardening (applied to the live project)

Migration: `supabase-production-hardening.sql` (also recorded in the project's migration history as `production_hardening_rls_and_indexes`).

| Finding | Severity | Action |
| --- | --- | --- |
| `verification_records` had policy `USING (true)` for role `public` — every visitor, including anon, could read all verification rows and their internal moderator `notes` | High (data leak) | Policy replaced with `is_admin()`-scoped SELECT; `anon` SELECT revoked. Re-probed: HTTP 401 |
| `contact_requests` accepted anon inserts with no constraints — spam/database-stuffing that bypasses the app's rate limiter | Medium | Insert policy constrained to `status = 'new' AND assigned_to IS NULL`. Forged `status='closed'` insert now 401s |
| `development_images` was world-readable, including images of unpublished developments | Low | Read policy now follows the parent `developments.is_published` |
| 26 foreign-key columns used in RLS predicates and joins had no index (e.g. `agents.user_id`, `conversations.property_id`, `viewing_requests.*`, `verification_*`, plus composite `messages(conversation_id, created_at)` and `enquiries(status, created_at)`) | Performance | Indexes created `IF NOT EXISTS` |
| Auth redirect allow-list still contained an abandoned Vercel preview origin (`degreensacre-jg8347331-5351.vercel.app`) that the owner no longer controls — a stale redirect target for password-recovery tokens | Medium | Allow-list reduced to `https://degreensacre.onrender.com/**` + `http://localhost:3000/**`; refresh-token rotation confirmed enabled |

### 2.7 Render blueprint

- Pinned `NODE_VERSION: 22.23.4`. `package.json` requires Node ≥22 and `.nvmrc` says `22.23.4`, but the blueprint did not pin it; a platform default of Node 20 makes `@supabase/supabase-js` warn (and eventually break) at runtime.
- `supabase-production-hardening.sql` un-ignored in `.gitignore` so the artifact ships with the repo.

## 3. Where the security boundary actually sits (reviewed, no change needed)

- **No service-role key anywhere.** `createAdminSupabaseClient()` returns the cookie-scoped RLS client; every admin query is enforced by policies, not by client trust.
- **Admin gating is layered:** `src/proxy.ts` blocks `/admin/*` at the edge; each admin route re-checks `profiles.is_admin` server-side; the DB re-checks `is_admin()` in every policy.
- **Public write routes are rate-limited** (`auth/register`, `auth/reset-password`, `contact`, `enquiries`, `book-inspection`, `viewings`, `reviews`, `geocode`).
- **Secrets hygiene:** `EMAIL_FROM`/`EMAIL_REPLY_TO` are validated in production, `sendEmail` refuses invalid recipients and CR/LF subject injection, no PII or tokens are logged, and the legacy `/api/email` relay only forwards `type: 'contact'` into the rate-limited contact handler.
- **Profile privilege escalation** is blocked by the `guard_profile_privileges` trigger; `set_admin_for_email` is executable by `service_role` only.

## 4. Known gaps, ranked

1. **`properties.admin_notes` is readable with the public anon key** (confirmed against the live REST API; currently `NULL` on the one published listing). It cannot be fixed in SQL alone: `revoke select (admin_notes)` breaks the six `select('*')` call sites that also serve public pages. Fix order: replace `select('*')` on `properties` with explicit column lists (mainly `src/lib/db-helpers.ts`, `src/app/api/widgets/featured/route.ts`, `src/app/api/admin/*`), then revoke the column — ideally after moving notes into the already admin-only `property_moderation_notes`.
2. **Transactional email rate limit.** Supabase is still on its built-in SMTP, which is hard-limited (order of a few messages per hour). With `mailer_autoconfirm: false`, signup confirmation emails *will* be throttled the moment real traffic arrives. Configure custom SMTP (Resend SMTP credentials) in Supabase Auth before launch.
3. **Password policy.** `password_min_length` is 6 server-side; the app enforces 8. Raise it to ≥10 in Auth settings (the management API used here does not expose this field).
4. **Rate limiting is per-process.** `src/lib/rate-limit.ts` uses an in-memory map. Correct for a single Render instance; move to Redis/Upstash before adding instances.
5. **Some admin API `catch` blocks return `error.message`.** Admin-only exposure, low risk; standardise on `databaseError()` while touching those routes.
6. **`contact_requests` remains open to anon inserts by design** (constrained). If it is unused, drop the policy entirely — no application code reads this table.

## 5. Owner actions still required (cannot be done from the repo)

- [ ] Rotate the previously documented Supabase service-role key and the admin password; treat old git history as public.
- [ ] Configure Supabase custom SMTP (Resend) and verify the sender domain used by `EMAIL_FROM`.
- [ ] Create the Render service from `render.yaml`, enter fresh secrets, confirm Node 22 and the Frankfurt region.
- [ ] Enable Supabase backups / point-in-time recovery and note the restore procedure.
- [ ] Register the owner account, then run the first-admin bootstrap from `RENDER_DEPLOYMENT.md`; verify a non-admin gets 403 on `/admin` and on `/api/admin/*`.
- [ ] Rehearse `supabase-schema.sql` → `supabase-production-cms-migration.sql` → `supabase-production-hardening.sql` on a staging project before pointing production at a fresh database.
- [ ] Add the custom domain in Render, update DNS, then set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin (and add it to Supabase's redirect allow-list).
- [ ] Set `GEOCODING_USER_AGENT` to a monitored contact and `CORS_ALLOWED_ORIGIN` to the production origin.
- [ ] Run a live end-to-end pass: signup → email confirmation → login → password reset → property submission with images → messaging → admin moderation → Resend delivery.
- [ ] Run Lighthouse/PWABuilder against the public HTTPS deployment.
- [ ] Add uptime monitoring on `/api/health` and error alerting (Render notifications or an APM).

## 6. How to reproduce this validation

```bash
npm ci
npm run type-check
npx eslint .
npm run build                      # passes with no env vars set

npm run build && npm run start     # with real NEXT_PUBLIC_SUPABASE_* in .env.local
curl -I http://localhost:3000/     # CSP + security headers
curl -s http://localhost:3000/api/health

# anon boundary (expect 401 for the first two)
curl -s "https://rvwirpfclysapqtnrlvx.supabase.co/rest/v1/verification_records?select=*" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
curl -s -X POST "https://rvwirpfclysapqtnrlvx.supabase.co/rest/v1/contact_requests" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Content-Type: application/json" \
  -d '{"name":"x","email":"x@example.com","message":"x","status":"closed"}'
```
