const CACHE_NAME = 'live2d-ultra-pwa-v1';
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './live2d-core.js',
    './paint.js',
    './mocap.js',
    './recorder.js',
    './manifest.json',
    'https://cubism.live2d.com/sdk-web/bin/cubismcore/live2dcubismcore.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
