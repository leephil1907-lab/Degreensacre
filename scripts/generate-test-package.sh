#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/test-package.zip"
TMP="$(mktemp -d)"
echo "[pwa] generating test package -> $OUT"
mkdir -p "$TMP/degreensacre-pwa-test"
cp "$ROOT/public/manifest.json" "$TMP/degreensacre-pwa-test/"
cp "$ROOT/public/sw.js" "$TMP/degreensacre-pwa-test/" 2>/dev/null || true
cp "$ROOT/public/offline.html" "$TMP/degreensacre-pwa-test/" 2>/dev/null || true
mkdir -p "$TMP/degreensacre-pwa-test/icons"
cp -r "$ROOT/public/icons" "$TMP/degreensacre-pwa-test/" 2>/dev/null || true
mkdir -p "$TMP/degreensacre-pwa-test/screenshots"
cp -r "$ROOT/public/screenshots" "$TMP/degreensacre-pwa-test/" 2>/dev/null || true
# Add a README
cat > "$TMP/degreensacre-pwa-test/README.txt" << 'EOF'
De-Greenacres PWA Test Package
Generated: $(date -u)
Manifest: manifest.json
Service Worker: sw.js
Icons: icons/
Screenshots: screenshots/ (1920x1080 wide, 1080x1920 narrow, etc.)
Install: npx serve .  ->  http://localhost:3000  -> DevTools > Application > Manifest
Store packaging: Use https://www.pwabuilder.com/reportcard
EOF
# Zip
(cd "$TMP" && zip -r "$OUT" degreensacre-pwa-test -q)
echo "[pwa] test package ready: $OUT ($(du -h "$OUT" | cut -f1))"
ls -lh "$OUT"
rm -rf "$TMP"
