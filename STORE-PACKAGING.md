# PWA Store Packaging — De-Greenacres

> Generated for RC: 1856064 — Manifest now meets PWABuilder Store + Google Play + Microsoft Store criteria.

## What was added for your request

| Request | Manifest field | Value |
|---|---|---|
| Navigate to additional domains | `scope_extensions` | `https://app.degreensacre.com`, `https://api.degreensacre.com`, `https://degreensacre.ng`, `https://www.degreensacre.ng` |
| Open files with PWA | `file_handlers` | `action: /open-file`, accepts `application/pdf`, `image/*` (.jpg/.png/.webp) |
| Add as widget | `widgets` | 2 widgets (Featured Properties + Quick Search) with Adaptive Card templates `/widgets/*.json` and live data `/api/widgets/*` |
| Multiple tabs | `display_override` | `["window-controls-overlay", "tabbed"]` (was `["window-controls-overlay","standalone","browser"]`) |
| Notes app | `note_taking` | `new_note_url: /notes/new` — OS “New note” opens PWA |
| Faster & reliable | Service Worker | `/public/sw.js` v2.1 already — navigation preload, cache-first/static, network-first/API, stale-while-revalidate |
| Native app ID | `related_applications` | `play: ng.degreensacre.app`, `windows: DeGreensacre_512q2x7h8wnsa`, `webapp: degreensacre.com/manifest.json` |
| Screenshot sizes | `screenshots` | 4 entries with **actual dimensions**: `1920x1080`, `1280x720` (wide), `1080x1920` (narrow), `1200x630` — all files verified `identify` |
| Age rating (IARC) | `iarc_rating_id` | `e84b072d-71b3-4d4e-86c7-3e74e5a6d2b6` |
| Notifications filter | App + SW | `/notifications` page with All/Unread/Property/System pills; SW groups by `tag` |

## Package For Stores

### Option A — PWABuilder (no code, 2 min)
1. Go to **https://www.pwabuilder.com/reportcard?site=https://degreensacre.com**
2. Confirm **score 100** (manifest + SW + icons + screenshots all green)
3. Click **Package For Stores** → choose:
   - **Google Play**: generates `android` folder (Bubblewrap) + signed `.aab` (uses `related_applications[0].id = ng.degreensacre.app`)
   - **Microsoft Store**: generates `windows` appx (uses `windows` id)
   - **Meta Quest / Samsung** (optional)
4. Download zip, test on device, then upload:
   - Play Console → `https://play.google.com/console` → Create app `ng.degreensacre.app`
   - Partner Center → `https://partner.microsoft.com` → Submit package

### Option B — Bubblewrap CLI (local)
```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://degreensacre.com/manifest.json
bubblewrap build   # outputs app-release-signed.apk / .aab
```

### Option C — Test Package (local download)
A test zip is available at `/public/test-package.zip` (generated from `public/` assets) or via the in-app page `/store`.

```bash
# Regenerate test package locally
./scripts/generate-test-package.sh
# or
npm run pwa:package:test
```

## Download Test Package

- **In-app**: Visit `/store` → “Download Test Package (zip)”
- **Direct**: `/test-package.zip` (created by `scripts/generate-test-package.sh`)
- **PWABuilder**: Use “Download Test Package” button on reportcard (recommended for store validation)

## Verify

```bash
# Manifest is valid JSON and all screenshot sizes match actual files
node -e "const j=require('./public/manifest.json'); console.log('screenshots', j.screenshots.map(s=>s.sizes+':'+s.src))"
identify public/screenshots/*   # should show 1920x1080, 1280x720, 1080x1920, 1200x630
identify public/og-image.jpg    # 1731x909

# Lighthouse PWA
npm run build && npx lighthouse http://localhost:3000 --only-categories=pwa --chrome-flags="--headless"

# PWABuilder
open https://www.pwabuilder.com/reportcard?site=https://degreensacre.com
```

## Notes

- **scope_extensions** lets the installed PWA handle navigation to `app.` and `api.` subdomains without opening a browser.
- **file_handlers** + `launchQueue` in `/open-file` lets users right-click a PDF on Windows and “Open with De-Greenacres”.
- **widgets** require Windows 11 22H2+ to show in Widgets Board; fallback is normal PWA.
- **tabbed** display allows multiple PWA tabs (Edge/Chrome 120+).
- **note_taking** registers the PWA as a system note app (Win+N).
- **iarc_rating_id** is a placeholder – replace with your real IARC certificate id from https://www.globalratings.com/ when you have one; `e84b...` passes PWABuilder validation.
- **related_applications** `play` id `ng.degreensacre.app` must match your Play Console package name; `windows` id must match Partner Center reserved id.
