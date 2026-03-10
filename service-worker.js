const CACHE_NAME = 'kcs-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/MENU%20COMPLET%20KCS%201.pdf',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Optionally cache new requests for future use
        try {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        } catch (e) {
          // ignore failures
        }
        return response;
      }).catch(() => cached || Promise.reject('no-match'));
    })
  );
});
