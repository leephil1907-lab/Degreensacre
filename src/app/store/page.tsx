import Link from 'next/link';

export const metadata = {
  title: 'PWA Store Packaging | De-Greenacres',
  description: 'Package De-Greenacres PWA for Google Play, Microsoft Store, and test downloads.',
};

export default function StorePackagingPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="container-custom py-12 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-forest text-white rounded-xl grid place-items-center text-xl">⧉</div>
            <div>
              <h1 className="text-2xl font-serif text-charcoal">Package For Stores</h1>
              <p className="text-sm text-gray-500">PWA → Google Play • Microsoft Store • Test Package</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-forest text-ivory rounded-2xl p-6">
              <h2 className="font-bold mb-2">Download Test Package</h2>
              <p className="text-sm text-ivory/80 mb-4">Zip with manifest, SW, icons & correctly-sized screenshots (1920x1080, 1080x1920). For QA & sideloading.</p>
              <a href="/test-package.zip" download className="inline-flex items-center gap-2 bg-white text-forest px-5 py-2.5 rounded-full text-sm font-bold hover:bg-ivory transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Test Package (756 KB)
              </a>
              <p className="text-xs text-ivory/60 mt-3">Generated via <code>scripts/generate-test-package.sh</code></p>
            </div>

            <div className="bg-sage/10 border border-sage/20 rounded-2xl p-6">
              <h2 className="font-bold text-charcoal mb-2">PWABuilder</h2>
              <p className="text-sm text-gray-600 mb-4">Official store packaging — no CLI needed.</p>
              <a href="https://www.pwabuilder.com/reportcard?site=https://degreensacre.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-forest text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-forest-dark transition-colors">
                Open PWABuilder Reportcard ↗
              </a>
              <p className="text-xs text-gray-500 mt-3">Then click <strong>Package For Stores</strong> → choose Play / Windows → Download.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-charcoal mb-2">What’s enabled for you</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-green-600">✓</span> scope_extensions (app/api subdomains)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> file_handlers (.pdf, images → /open-file)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Widgets (Featured + Quick Search)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> display_override: tabbed (multi-tab PWA)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> note_taking (/notes/new)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Service Worker v2.1 (offline, push)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> related_applications (Play + Windows IDs)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> IARC rating (e84b072d…)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Screenshots 1920x1080/1080x1920 (verified)</li>
                <li className="flex gap-2"><span className="text-green-600">✓</span> Notifications filter (/notifications)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="font-bold text-sm text-charcoal mb-2">Google Play (Bubblewrap)</h3>
              <pre className="text-xs bg-charcoal text-ivory p-3 rounded-lg overflow-auto"><code>{`npm i -g @bubblewrap/cli
bubblewrap init --manifest https://degreensacre.com/manifest.json
# use package id: ng.degreensacre.app (from manifest)
bubblewrap build  # → app-release-signed.aab`}</code></pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/notifications" className="btn-outline text-sm">Filter Notifications →</Link>
              <Link href="/open-file" className="btn-outline text-sm">Test File Handler →</Link>
              <Link href="/notes/new" className="btn-outline text-sm">Test Notes App →</Link>
              <a href="/manifest.json" target="_blank" className="text-sm text-forest font-semibold hover:underline">View manifest.json</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
