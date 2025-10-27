const CACHE_NAME = 'kcs-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/KCS%20MENU%20classique%20OCTOBRE%202025.pdf',
  '/KCS%20MENU%20COMBO%20OCTOBRE%202025.pdf',
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
