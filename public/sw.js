
const CACHE_NAME = 'cardano2vn-v1';
const urlsToCache = [
  '/',
  '/login',
  '/images/wallets/eternal.png',
  '/images/wallets/lace.png',
  '/images/wallets/yoroi.png',
  '/images/wallets/metamask.png',
  '/images/wallets/google.png',
  '/images/wallets/github.png'
];

self.addEventListener('install', event => {
  console.log('Cardano2VN Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache failed:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Cardano2VN Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('Cardano2VN Service Worker loaded');
