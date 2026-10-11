// Service Worker per Pixò Fleet Commander PWA
const CACHE_NAME = 'pixo-commander-v25';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css?v=25',
  './app.js?v=25',
  './manifest.json?v=25',
  './icon-commander.svg',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/mqtt/dist/mqtt.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW Commander] Cache iniziale parziale:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW Commander] Rimozione vecchia cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategia Network-First: cerca SEMPRE la versione più recente sul server
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('ws:') || event.request.url.startsWith('wss:')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
