// Service worker — сайтты офлайн жұмыс істетеді және "қолданбадай" жылдам ашылуын қамтамасыз етеді.
// Жаңа нұсқа шығарғанда CACHE_NAME мәнін өзгертіңіз (мыс. 'iqarena-v2') — ескі кэш автоматты тазаланады.

const CACHE_NAME = 'iqarena-v9';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './games/sound.js',
  './games/numbers.js',
  './games/memory.js',
  './games/geo.js',
  './games/origins.js',
  './games/world-data-1.js',
  './games/world-data-2.js',
  './games/world-data-3.js',
  './games/world-data-4.js',
  './games/world.js',
  './games/twenty48.js',
  './games/snake.js',
  './games/simon.js',
  './games/whack.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
