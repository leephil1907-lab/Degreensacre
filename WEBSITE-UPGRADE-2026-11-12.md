# Website upgrade — what I changed, and what is left

**Date:** 12 November 2026
**Method:** production build served locally, rendered in headless Chromium at 1440 / 1024 / 768 / 390 / 320 px across 7 pages, with overflow and console-error measurement on every combination, plus end-to-end calls against the live Supabase project.

---

## 1. Functional defects found by actually exercising the site

These were silent — the pages rendered, but the features behind them were dead.

| # | Defect | Evidence | Fix |
| --- | --- | --- | --- |
| 1 | **Property view counts never recorded.** The counter RPC was executable only by `service_role`, which the app deliberately does not use. | Server log: `permission denied for function increment_property_views` on every property view | Granted `EXECUTE` to `anon`/`authenticated` (the function only bumps the counter on published listings, returns `void`) |
| 2 | **Per-view analytics rows could never be written.** `property_views` had *no* INSERT policy at all. | RLS policy listing showed only an admin SELECT policy | Added `property_views_insert_own` (signed-in visitors only; anonymous visits are counted in aggregate and no IP/UA is stored) |
| 3 | **View inflation.** Every page refresh incremented the counter. | Each property fetch called the RPC unconditionally | One count per visitor per listing per 30 minutes (existing in-process limiter), and analytics failures never break a page view |
| 4 | **Private storage buckets had no upload limits** — `property-documents` and `verification-documents` accepted any type at any size. | `storage.buckets` had `file_size_limit: null`, `allowed_mime_types: null` | 10 MB cap + PDF/DOC/DOCX/JPEG/PNG/WebP allow-list |

**Verified working end to end against production data:** property list API (`200`, 1 listing), property detail API (`200`, view counter incremented to 412), site settings, featured widget, contact form (`201`, row written), inspection booking (`201`), enquiry (`200`, row written), unknown property (`404`), unauthenticated admin API (`401`). All QA rows deleted afterwards.

---

## 2. Typography — the biggest professionalism defect

The brand fonts were **not loading on any page**. `next/font` variables were defined, but the generated `font-sans` / `font-serif` utilities were being dropped in the Tailwind v4 `@theme` + `@config` duplication, so every paragraph fell back to the operating system's default stack (`-apple-system, Segoe UI, Roboto…`) while only `font-display` resolved correctly.

Measured before: `body → -apple-system…` · Measured after: `body → Manrope`, headings → `DM Serif Display`.

This alone changes how "designed" the site feels, because body copy on every page now uses the intended face.

---

## 3. Responsiveness defects (desktop + mobile)

| Issue | Where | Fix |
| --- | --- | --- |
| **Transient horizontal page pan** — reveal animations offset content by 40 px horizontally before entering view, growing document scroll width on phones | Every `ScrollReveal(direction="left"/"right")` section | `overflow-x: clip` at the root, which keeps the animation and removes the sideways jank |
| **Hero disclosure caption collided with the search card** on phones ("Illustrative imagery · not property listings" was half-hidden behind the card) | Home hero | Caption moved to the top-left of the hero on small screens, bottom-left on desktop |
| **Clipped category chips looked broken** ("Commerci…", half a chip at the edge) with no affordance that the row scrolls | Home search tabs, property filters | New `.scroll-row` utility: hidden scrollbar, snap points, and a trailing fade **only below 1280 px** where the row actually overflows (desktop chips no longer look disabled) |
| **View-switcher (Map / Grid / List) orphaned on its own right-aligned row** on mobile | Property search | Becomes a full-width segmented control below `sm`, returns to the right-hand group at `xl` |
| **A single listing sat left-aligned in a 3–4 column grid**, leaving two-thirds of the section empty — looked half-built | Home "Featured listings", `/properties` results | Responsive cards in a centred flex row: 1 card centres, 2 centre, 3+ fill the row exactly as before |
| **"Search properties" wrapped onto two lines** inside the narrow hero column | Home hero | Button copy tightened to "Search" with a non-wrapping label and a fixed icon |

**Re-audit after the fixes:** 7 pages × 5 viewports = 35 combinations, all `scrollWidth === clientWidth` (no horizontal overflow anywhere, including 320 px) and **zero console errors**.

---

## 4. Perceived-quality fixes (the "stock template" tells)

1. **Listing placeholders looked broken.** A tiny house glyph floated in a white box with the caption "Property photo coming soon" rendering at 6 px. Replaced with a full-bleed branded placeholder (`public/property-placeholder.svg`: soft sage gradient, dot grain, forest line-art) plus a proper "Photos coming soon" pill. Applied to home, search results, land page and the detail gallery.
2. **The property detail gallery was a giant empty grey box** with a map pin. It now shows the branded artwork and an explicit, honest caption ("Our listing team is arranging verified photographs…") over a soft gradient, so a photo-less listing reads as intentional rather than broken.
3. **An empty white card floated under "Contact Agent"** — an AdSense wrapper whose ad unit renders nothing until AdSense is configured. Every ad wrapper (detail page ×2, home ×2, land ×2, insights, in-feed) is now conditional on a real publisher ID, so unconfigured ad slots leave no ghost boxes or blank bands.
4. **The detail page used a second, legacy colour system** — bright Tailwind `green-500/600` buttons, `green-100` badges — next to the brand forest green used everywhere else. All 37 legacy green utilities were mapped to brand tokens (`forest`, `forest-50`, `forest-800`), keeping WhatsApp's mandated `#25D366` as the single intentional exception. The homepage WhatsApp CTA section had the same `bg-green-600` mismatch and is now `forest`.
5. **Heading hierarchy** now uses the serif display face consistently on the detail page (it was rendering as bold sans because of the same font bug).

---

## 5. What I recommend next (ranked, not yet done)

**P0 — the single biggest remaining gap: there are no property photographs.** One listing, one placeholder. No amount of layout polish overcomes a marketplace whose cards show a house icon. Upload 5–10 real photos per listing (the `property-images` bucket, 5 MB/JPEG-PNG-WebP limits and owner/admin RLS policies are already correct) and the site immediately reads as a real business.

**P1 — content and trust surface**
- Real inventory: aim for 8–12 published listings before launch so search, filters, map view, "similar properties" and pagination all have something to show. Today the map view, filters and in-feed ads have nothing to exercise.
- Replace the placeholder hero images (`/properties/property-1..5.jpg`) with licensed photography of actual De-Greenacres stock.
- Agent/agency profiles, developments and insights are all wired up but empty — three or four real entries each make the site look established and give Google something to index.

**P1 — search/discovery**
- Listing pages are client-rendered for the results grid. Google indexes them, but server-rendering the first page of results (or adding `generateStaticParams` + ISR for hot listings) would improve first paint and crawl depth.
- Add `RealEstateListing`/`Offer` structured data per property (the site already ships `RealEstateAgent` on the homepage).
- Add `sitemap` entries for published listings only after removing `sample` properties, so the sitemap never advertises placeholders.

**P2 — conversion and operations**
- Save-search + alert emails exist in code; confirm the Resend domain and Supabase SMTP so they actually send (this is still the biggest functional risk — see `PRODUCTION-AUDIT-2026-11-12.md` §5).
- Add a lightweight analytics tool (Plausible/GA4) — right now there is no traffic data at all, and ad/AdSense revenue depends on it.
- Consider a web manifest/install check on a real Android device after the domain is live.

**P2 — polish**
- Dark mode exists in the header toggle; the detail page was not designed against it — worth a pass once photos are in.
- The logo asset in the header is dark-on-dark at small sizes; a light-background variant would lift the very first impression.

---

## 6. Files touched

```
src/app/globals.css                          brand font tokens, scroll-row, overflow-x clip
src/app/page.tsx                             centred featured grid, placeholder art, CTA colour, ad wrappers
src/app/properties/page.tsx                  centred results, segmented view control, chips, placeholder art
src/app/properties/[slug]/PropertyDetailClient.tsx   gallery placeholder, brand palette, ad wrappers
src/app/land/page.tsx                        placeholder art, ad wrappers
src/app/insights/page.tsx                    ad wrapper
src/components/HeroCarousel.tsx              disclosure caption position
src/components/HeroSearch.tsx                scroll-row tabs, non-wrapping submit
src/components/GoogleAdsense.tsx             adsenseConfigured flag
src/lib/db-helpers.ts                        view recording (aggregate + signed-in detail rows)
src/app/api/properties/[slug]/route.ts       per-visitor view rate limiting
public/property-placeholder.svg              new branded placeholder artwork
```

Database changes in this pass: `increment_property_views` grant, `property_views` INSERT policy, storage bucket upload limits on the two private buckets.
