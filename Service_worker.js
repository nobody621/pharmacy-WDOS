// sw.js

// Cache version
const CACHE_NAME = 'my-cache-v1';

// Files to cache
const URLs_TO_CACHE = [
  '/Hospital-website/',
  '/Hospital-website/index.html',
  '/Hospital-website/css/index.css',
  '/Hospital-website/css/common.css',
  '/Hospital-website/js/index.js',
  '/Hospital-website/pharmacy.html',
  '/Hospital-website/checkout.html',
  '/Hospital-website/js/cart.js',
  '/Hospital-website/js/checkout.js',
  '/Hospital-website/json/initial_cart.json',
  '/Hospital-website/json/medicines.json',
  '/Hospital-website/resourses/logo.jpg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLs_TO_CACHE);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
