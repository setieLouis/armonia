const CACHE_NAME = 'armonia-flow-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/pwa/logo.png',
  '/service/local_db.js',
  '/service/data_handler.js',
  '/components/welcome/welcome.html',
  '/components/welcome/welcome.js',
  '/components/welcome/welcome.css',
  '/components/today/today.html',
  '/components/today/today.js',
  '/components/today/today.css',
  '/components/current-meal/current-meal.html',
  '/components/current-meal/current-meal.js',
  '/components/current-meal/current-meal.css',
  '/components/ingredient/ingredient.html',
  '/components/ingredient/ingredient.js',
  '/components/ingredient/ingredient.css',
  '/leaf.png',
  '/components/welcome/sfondo.jpg',
  '/components/welcome/other_sfondo.jpg',
  '/ui/prima.png',
  '/ui/seconda.png',
  '/ui/terza.png',
  'https://unpkg.com/dexie/dist/dexie.js'
];

// Install Event: Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event: Serve from cache, then network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle requests to the root with query parameters (like ?source=pwa)
  if (url.origin === location.origin && url.pathname === '/') {
    event.respondWith(caches.match('/'));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
