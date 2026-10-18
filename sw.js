/* Service worker: la app funciona 100% sin internet.
   Estrategia: responde desde caché y actualiza en segundo plano
   (los cambios se ven en la siguiente apertura).
   Si publicas una versión nueva, sube el número de CACHE para limpiar la anterior. */
const CACHE = 'finanzas-wendy-v1';

const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'manifest.json',
  'data/config.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('finanzas-wendy-') && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const red = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copia));
          }
          return res;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(red);
        return cached;
      }
      return red.then((res) => {
        if (res) return res;
        if (req.mode === 'navigate') return caches.match('./');
        return Response.error();
      });
    })
  );
});
