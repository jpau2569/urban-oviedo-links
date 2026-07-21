/*
 * Castresana OS — service worker.
 * Estrategia:
 *  - Precache del shell mínimo (/ y /offline).
 *  - Navegaciones: red primero con fallback a caché y, en último término, /offline.
 *  - Estáticos de Next (/_next/static) y fuentes: cache-first (inmutables por hash).
 *  - Nunca cachea rutas de portal con token ni peticiones no-GET.
 */

const VERSION = "castresana-os-v1";
const PRECACHE = ["/", "/offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const isStaticAsset = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.match(/\.(png|svg|ico|woff2?)$/) ||
  url.hostname === "fonts.gstatic.com" ||
  url.hostname === "fonts.googleapis.com";

const isPrivatePortal = (url) =>
  url.pathname.startsWith("/client-portal/") || url.pathname.startsWith("/owner-portal/");

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Estáticos inmutables: cache-first.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") cache.put(req, res.clone());
        return res;
      })
    );
    return;
  }

  // Navegaciones: red primero; sin red → caché → /offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Los portales privados no se cachean (contenido por token).
          if (res.ok && !isPrivatePortal(url)) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match("/offline");
        })
    );
  }
});
