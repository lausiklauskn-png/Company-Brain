/* Company Brain — Service Worker (offline App-Schale, cache-first).
   Fremde Origins werden durchgereicht (z. B. bewusst freigeschaltete EU-KI). */
const CACHE = "company-brain-v0-2";
const SHELL = [
  "./",
  "./index.html",
  "./app-manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./impressum.html",
  "./modules/03_embedding.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Nur eigene Origin cachen; alles Fremde (EU-KI etc.) direkt durchreichen.
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
