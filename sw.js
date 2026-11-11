// Service Worker：快取靜態檔，離線可用。改檔案後請調高 CACHE 版本號，否則手機會看到舊版。
var CACHE = 'color-tool-v2';
var PREFIX = CACHE.replace(/\d+$/, '');   // 只清自己的舊版暫存（同網域還有遊戲王國等其他 App，不能動別人的）
var FILES = [
  './', 'index.html', 'style.css', 'app.js',
  'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

// 清掉「自己的」舊版本快取
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf(PREFIX) === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

// 網路優先（改了檔案馬上看得到），失敗才用快取
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () { return caches.match(e.request); })
  );
});
