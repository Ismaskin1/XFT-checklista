// Service worker för XFT Utrustningschecklista.
// Gör att appen startar även utan uppkoppling: sidan hämtas från nätet när det går
// (så att uppdateringar alltid slår igenom) och från cachen när nätet saknas.
const CACHE = 'xft-checklista-v3.4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  // Varje fil cachas för sig: en fil som tillfälligt inte går att hämta får inte
  // stoppa hela installationen, för då tappar appen sitt offlinestöd helt.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(fil => c.add(fil).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  // Endast GET inom samma origin hanteras — rapportutskick till Formspree rörs aldrig.
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // no-cache tvingar webbläsaren att fråga servern om sidan ändrats, så att en ny
    // version alltid slår igenom direkt i stället för att ligga kvar i webbläsarens cache.
    e.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }))
  );
});
