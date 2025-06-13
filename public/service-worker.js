/* eslint-env serviceworker */
/* eslint-disable no-restricted-globals */
/* global self, caches */

const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/css/main.chunk.css'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached assets or API responses when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(networkResponse => {
            if (event.request.url.includes('/vip/')) {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          })
          .catch(() => {
            if (event.request.url.includes('/vip/')) {
              return new Response(JSON.stringify({ error: 'Offline mode, data unavailable' }), {
                headers: { 'Content-Type': 'application/json' }
              });
            }
            return new Response('Offline mode, resource unavailable');
          });
      })
  );
});