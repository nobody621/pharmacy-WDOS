self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('my-cache').then(function(cache) {
        return cache.addAll([
          '/Hospital-Website-WDOS/',
          '/Hospital-Website-WDOS/index.html',
          '/Hospital-Website-WDOS/styles/style.css',
          
          '/Hospital-Website-WDOS/js/script.js',
          '/Hospital-Website-WDOS/js/script2.js',
          '/Hospital-Website-WDOS/js/main.js',
          '/Hospital-Website-WDOS/Service_worker.js',
          '/Hospital-Website-WDOS/favicons/android-chrome-192x192.png',
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registered with scope: ', registration.scope);
      }).catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
      });
    });
  }