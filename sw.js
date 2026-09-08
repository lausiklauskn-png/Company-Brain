/* Company Brain — Service Worker (offline App-Schale, cache-first).
   Fremde Origins werden durchgereicht (z. B. bewusst freigeschaltete EU-KI). */
const CACHE = "company-brain-v0-5";

/* ⚠ NUR EIGENE VORRAETE AUFRAEUMEN — `caches` gehoert dem URSPRUNG, nicht dem
 * Pfad. Auf lausiklauskn-png.github.io liegen rund zwanzig Apps; ein Filter,
 * der nur "ist nicht meiner" fragt, laesst ALLE fremden durch und loescht sie.
 * Gemessen am 2026-09-08 an zwei echten Apps
 * (Sage-Protokol/tests/vorrat_wirkung.mjs). Praefix ABGELESEN aus der
 * Vorrat-Konstante, nicht geraten. Muster aus Tomys-Hub/bookledger/sw.js.
 * Es muss BEIDES tun: fremde stehen lassen UND eigene alte weiter wegraeumen. */
const VORRAT_PRAEFIX = "company-brain-";
const SHELL = [
  "./",
  "./index.html",
  "./app-manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./impressum.html",
  "./modules/01_storage.js",
  "./modules/02_spore.js",
  "./modules/03_embedding.js",
  "./modules/04_match.js",
  "./modules/05_anastomose.js",
  "./modules/05b_nostr_relay.js",
  "./modules/noble-secp256k1.js",
  "./modules/23_rendezvous.js",
  "./modules/rendezvous-init.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(VORRAT_PRAEFIX) && k !== CACHE).map(k => caches.delete(k))))
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
