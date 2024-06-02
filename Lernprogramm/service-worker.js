const CACHE_NAME = 'lernprogramm-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/questions.json',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

// Installationsereignis - Cachen der erforderlichen Dateien
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache geöffnet');
        return cache.addAll(urlsToCache);
      })
  );
});

// Abrufereignis - Bedienen der Anfragen aus dem Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Falls eine Übereinstimmung gefunden wird, wird sie zurückgegeben, ansonsten wird der Netzwerkrequest durchgeführt
        return response || fetch(event.request);
      })
  );
});

// Aktivierung des neuen Service Workers und Löschen alter Caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
