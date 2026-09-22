/* De-Greenacres Service Worker — production PWA v2.1 */
const CACHE_VERSION = 'de-greenacres-v2.1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const OFFLINE_URL = '/offline.html';

// Assets to precache on install — only files that actually exist
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/favicon.png',
  '/logo-icon.png',
  '/og-image.jpg'
];

// Cache-first patterns (immutable assets)
const CACHE_FIRST_PATTERNS = [
  /\/icons\/.*\.png$/,
  /\/properties\/.*\.jpg$/,
  /\.(?:png|jpg|jpeg|svg|webp|woff2?)$/
];

// Network-first patterns (HTML navigations + API)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
];

// Install — precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] precache failed', err))
  );
});

// Activate — clean old caches + enable navigation preload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if supported
      if ('navigationPreload' in self.registration) {
        try { await self.registration.navigationPreload.enable(); } catch {}
      }
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
            .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// Fetch — strategies per request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // Bypass non-http, chrome-extension, etc
  if (!url.protocol.startsWith('http')) return;

  // Navigation requests — network-first, fallback to cache, then offline.html
  if (request.mode === 'navigate') {
    event.respondWith(navigationHandler(event));
    return;
  }

  // API requests — network-first with cache fallback (short TTL)
  if (NETWORK_FIRST_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }

  // Static assets — cache-first, network fallback + cache update
  if (CACHE_FIRST_PATTERNS.some((p) => p.test(url.pathname))) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
});

// ----- Strategies -----

async function navigationHandler(event) {
  const { request } = event;
  try {
    // Try preload response first
    const preload = await event.preloadResponse;
    if (preload) {
      // Cache a clone for offline
      const clone = preload.clone();
      event.waitUntil(caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone)));
      return preload;
    }
    const network = await fetch(request);
    // Cache successful navigations
    if (network.ok) {
      const clone = network.clone();
      event.waitUntil(caches.open(RUNTIME_CACHE).then((c) => c.put(request, clone)));
    }
    return network;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const shell = await caches.match('/');
    if (shell) return shell;
    return caches.match(OFFLINE_URL);
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    // Update in background
    eventUpdate(request, cacheName);
    return cached;
  }
  try {
    const network = await fetch(request);
    if (network.ok) {
      const clone = network.clone();
      await caches.open(cacheName).then((c) => c.put(request, clone));
    }
    return network;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(request, cacheName) {
  try {
    const network = await fetch(request);
    if (network.ok) {
      const clone = network.clone();
      await caches.open(cacheName).then((c) => c.put(request, clone));
    }
    return network;
  } catch {
    const cached = await caches.match(request);
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(async (network) => {
    if (network.ok) {
      const clone = network.clone();
      await caches.open(cacheName).then((c) => c.put(request, clone));
    }
    return network;
  }).catch(() => cached);
  return cached || fetchPromise;
}

function eventUpdate(request, cacheName) {
  // fire-and-forget background update
  fetch(request).then((network) => {
    if (network.ok) caches.open(cacheName).then((c) => c.put(request, network));
  }).catch(() => {});
}

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-properties') {
    event.waitUntil((async () => {
      console.log('[SW] sync-properties');
      // Could sync pending enquiries when back online
    })());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json().catch(() => ({ body: event.data.text() })) : {};
  Promise.resolve(data).then((payload) => {
    const title = payload.title || 'De-Greenacres Properties';
    const options = {
      body: payload.body || 'New property alert from De-Greenacres',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: payload.tag || 'general',
      renotify: true,
      data: { url: payload.url || '/', dateOfArrival: Date.now() },
      actions: payload.actions || [
        { action: 'open', title: 'View' },
        { action: 'close', title: 'Dismiss' }
      ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  if (event.action === 'close') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const win of wins) {
        if (win.url.includes(self.location.origin) && 'focus' in win) return win.focus();
      }
      return clients.openWindow(url);
    })
  );
});

// Message handler — allow app to trigger skipWaiting
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((c) => c.addAll(event.data.payload))
    );
  }
});
