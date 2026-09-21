// The equipment checklist has moved to checklista.xft.se. This service worker
// replaces the old one, throws away every cached page and removes itself, so
// a phone that had the old app installed fetches the new address instead.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (key) { return caches.delete(key); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) { clients.forEach(function (client) { client.navigate(client.url); }); })
  );
});
