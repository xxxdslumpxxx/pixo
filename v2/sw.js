// Service Worker per Pixò v2 PWA
const CACHE_NAME = 'pixo-v2-cache-v28';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './pixo_face.png',
  'https://unpkg.com/mqtt/dist/mqtt.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[SW v2] Cache immediata parziale:', err);
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
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.startsWith('ws:') || event.request.url.startsWith('wss:')) {
    return;
  }
  // Isola completamente l'area /admin/ lasciando la gestione al SW dedicato
  if (event.request.url.includes('/admin/')) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Click su notifica di sistema per aprire o mettere a fuoco la schermata di Pixò
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// Ricezione Notifica Push in Standby / Background
self.addEventListener('push', (event) => {
  let title = 'Pixò 🎨';
  let body = 'Nuovo disegno apparso su Pixò!';
  try {
    if (event.data) {
      const text = event.data.text();
      try {
        const json = JSON.parse(text);
        if (json.title) title = json.title;
        if (json.body || json.message) body = json.body || json.message;
      } catch (err) {
        body = text;
      }
    }
  } catch (e) {}

  const options = {
    body: body,
    icon: new URL('pixo_face.png', self.location.href).href,
    vibrate: [200, 100, 200],
    tag: 'pixo-drawing-alert',
    renotify: true,
    data: { url: './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
