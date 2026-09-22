# Audit: Static vs Database — Are We Pretending?

**Date:** 2026-09-22
**Principle:** Freeze design → audit every critical user journey → fix integration → deploy.
Static data is legitimate for *editorial* or *fallback/demo*, but the **marketplace must be DB-primary** and honest about its source.

## 1. Inventory

| Static module | Lines | Supabase table | Rows in Supabase | Verdict |
|---------------|-------|----------------|------------------|---------|
| `src/data/properties.ts` | 450 | `properties` | **9** (all `status=available`, mixed `type`) | **Marketplace — must be DB-primary** |
| `src/data/developments.ts` | 185 | `developments` | **0** | Marketplace-like — DB exists, empty → fallback OK but must be honest |
| `src/data/locations.ts` | 188 | `locations` | **404 — table does not exist** | Pure reference data — **legitimately static** |
| `src/data/articles.ts` | 93 | `articles` | **404 — table does not exist** | Editorial — **legitimately static** (no DB counterpart) |

**Supabase also has:** `agencies` (0 rows, 13 cols) + `agents` (0 rows, 13 cols) — newly created, **public SELECT allowed, anon INSERT blocked by RLS**, not yet connected to UI at all.

**Relevant libs:** `src/lib/db-helpers.ts` (`getProperties`, `getPropertyBySlug`), `src/lib/supabase.ts` / `supabase-server.ts` (anon + RLS), `src/app/api/properties/*` (DB-driven).

## 2. Where static is imported

```
src/app/page.tsx                          → properties (featured + land)  ❌ DB should win
src/app/land/page.tsx                     → properties (land)             ❌ DB should win
src/app/location/{lga}/page.tsx ×4        → properties (filtered by state)❌ DB should win
src/app/diaspora/page.tsx                 → properties                     ⚠️ editorial/feature — fallback OK
src/app/developments/page.tsx + [slug]    → developments                   ⚠️ DB empty → fallback OK
src/app/insights/page.tsx + [slug]        → articles (local const 6) + data/articles (5) → editorial, OK but duplicated
src/app/properties/page.tsx               → sampleProperties + DB merge (dedup by slug, DB wins) ✅ honest
src/app/properties/[slug]/PropertyDetailClient.tsx → sampleProperties fallback after fetch ✅ honest
src/components/*Matchmaker, Similar, etc  → properties (static)            ❌ should be DB/prop-driven
```

`locations.ts` — imported nowhere. `locations` table does not exist in Supabase, so static reference is correct.

## 3. Critical journey audit (is it DB-driven or pretending?)

| Journey | File | Current source | DB-aware? | Risk |
|---------|------|----------------|-----------|------|
| **Homepage featured 6** | `src/app/page.tsx:14` `sampleProperties = properties.filter(s=>sample&&featured)` | **Static only** | No | **HIGH: User sees demo duplexes in Ikoyi that may not exist in DB. 9 DB props are invisible on homepage.** |
| **Homepage land 2** | `src/app/page.tsx:15` `landProperties = properties.filter(type=land)` | Static only | No | HIGH |
| **Marketplace browse** | `src/app/properties/page.tsx:49-82` merge `sampleMapped + dbProperties` dedup | **Yes, DB wins, static fallback** | Yes | LOW — but shows ~18 cards (9 DB + 9 static) — should be clear what's demo vs live. Needs DemoBadge when fallback visible. |
| **Property detail** | `PropertyDetailClient.tsx` fetch then `sampleProperties.find` | DB primary, fallback | Yes | LOW |
| **Land page listings** | `src/app/land/page.tsx:11` static filter | Static only | No | **HIGH: `/land` shows 4 static land plots, ignoring 2 DB land plots (`1000sqm-residential-land-ajah`, `premium-plots-new-coastal-highway-uyo` is overlapping but others missing).** |
| **Location pages** | `src/app/location/*/page.tsx` static filter | Static only | No | **HIGH: Lagos/Uyo/Enugu/Abuja pages show static demo props, not DB filtered by state. No DB pagination.** |
| **Developments list/detail** | `src/app/developments/page.tsx` static 2 | Static only, DB 0 | Partial | MEDIUM — DB table empty, so fallback is only option. Must fetch DB first, then fallback, and show “Demo data” badge until DB seeded. |
| **Insights** | `src/app/insights/page.tsx` local const 6, `insights/[slug]` from `data/articles` 5 | Static editorial | N/A | LOW — editorial can stay static, but local const vs data/articles duplication is confusing; should unify and label editorial. |
| **Agents / Agencies** | **No pages** `src/app/agents`/`agencies` don't exist | Tables exist (0 rows), no UI | No | **HIGH: Tables exist with columns (`agencies: id,name,slug,email,phone,logo_url,description,address,state,website,is_verified,created_at,updated_at`; `agents: id,name,slug,email,phone,whatsapp,bio,photo_url,agency_id,user_id,is_verified`) but zero connection to properties or user journeys.** |
| **Similar / Matchmaker** | `components/SimilarProperties.tsx` static | Static | No | MEDIUM |
| **Diaspora** | static | Static | N/A | LOW — editorial/feature |

**Conclusion:** Marketplace *core* (`/properties`) is honest. **Periphery (`/`, `/land`, `/location/*`, `/developments`) is pretending** — they look like the marketplace but bypass the DB entirely.

## 4. Agents / Agencies schema (discovered via PostgREST probes)

**`agencies` (public readable, anon insert blocked):**
`id uuid pk`, `name text`, `slug text unique`, `email text`, `phone text`, `logo_url text`, `description text`, `address text`, `state text`, `website text`, `is_verified bool`, `created_at`, `updated_at`

**`agents` (public readable):**
`id uuid pk`, `name text`, `slug text unique`, `email text`, `phone text`, `whatsapp text`, `bio text`, `photo_url text`, `agency_id uuid fk→agencies`, `user_id uuid fk→profiles`, `is_verified bool`, `created_at`, `updated_at`

**`properties` linkage:** `owner_id → profiles.id`, plus legacy `agent`, `agent_phone`, `agent_email` text fields (not FK). New design should use `owner_id` → `profiles` → `agents.agency_id` → `agencies` chain.

**Current state:** 0 agencies, 0 agents, 1 profile (admin, `account_type=buyer`). So even after wiring UI, lists will be empty until seeded.

## 5. Fix strategy (no redesign)

**Rule:** Every *marketplace* page tries Supabase first (`/api/properties`, `/api/developments`, `/api/agencies`, `/api/agents`), then *falls back* to static `src/data/*` only if DB empty/error, and when falling back shows `DemoBanner` (“Preview · Demo data — live data will appear here once Supabase is seeded”).

1. **API:** Create `/api/developments`, `/api/agencies`, `/api/agents` (and `[slug]` variants) that read the tables with same pattern as `/api/properties`. Reuse `createServerSupabaseClient`.
2. **Homepage / Land / Location:** Refactor to `useEffect` fetch with fallback to static, keeping identical UI. Extract helper `useDbProperties`.
3. **Developments:** Make `developments/page.tsx` + `[slug]` DB-primary with fallback to static `developments`.
4. **Agents/Agencies UI:** Create `/agencies`, `/agencies/[slug]`, `/agents`, `/agents/[slug]` that fetch from new APIs, show `DemoBanner` when empty, link to filtered `/properties?agent=...` or `agency=...` (or at least to profile). Update `PropertyDetailClient` agent card to try `agents` table by `owner_id`/`user_id` before falling back to legacy `property.agent` fields.
5. **Editorial stays static:** `locations.ts` and `articles` remain static, but unify `insights/page.tsx` local const vs `data/articles` duplication (keep local const as editorial for now, add comment).
6. **Seed:** Provide `supabase-seed-agencies-agents.sql` for dashboard to run — inserts 2 agencies + 3 agents + links to existing properties via `owner_id`, plus 2 developments from static.
7. **Honesty:** Add `DemoBadge/DemoBanner` wherever fallback is visible so QA can see at a glance what is live vs demo.

**Out of scope (frozen):** No new design system, no giant feature list, no change to `locations.ts`/`articles.ts` DB.

## 6. Next steps

- [ ] Ship audit (this file)
- [ ] Create APIs
- [ ] Refactor homepage, land, developments, location to DB-primary + fallback + DemoBanner
- [ ] Wire agents/agencies UI + property detail linkage
- [ ] Provide seed SQL
- [ ] Verify `npm run build` 68 routes + `tsc --noEmit`
- [ ] Push
