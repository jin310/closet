const CACHE_NAME = 'closet-v11';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://r.jina.ai/i/669f37be704043b483b28b6d089689a7'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 优先网络，失败时尝试缓存，确保页面始终能打开
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        if (response) return response;
        // 如果是导航请求失败且无缓存，返回首页内容防止404
        if (event.request.mode === 'navigate') {
          return caches.match('./');
        }
      });
    })
  );
});