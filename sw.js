const CACHE_NAME = 'radio-mixto-v1';

// Instalar el Service Worker
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

// Activar el Service Worker
self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Escuchar peticiones en segundo plano (Requisito para PWA)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request);
        })
    );
});
