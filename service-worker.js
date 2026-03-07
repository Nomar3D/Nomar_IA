const CACHE_NAME = 'nomar-ia-v2';
const ASSETS = [
  '/Nomar_IA/',
  '/Nomar_IA/index.html',
  '/Nomar_IA/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - NEVER cache API calls
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Bypass: toujours fetch direct pour les appels API externes
  if (
    url.includes('workers.dev') ||
    url.includes('anthropic.com') ||
    url.includes('googleapis.com/css') ||
    event.request.method !== 'GET'
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Pour les assets du site : cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
