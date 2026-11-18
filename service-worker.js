const CACHE_NAME = "international-esim-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
