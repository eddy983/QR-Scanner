"use strict";

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/assets/css/main.min.css",
  "/assets/css/phone.min.css",
  "/assets/js/jquery-1.11.3.min.js",
  "/assets/js/video.js",
  "/assets/js/zxing.js"
];

self.addEventListener("install", evt => {
  console.log("[ServiceWorker] Install");
  // CODELAB: Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", evt => {
  console.log("[ServiceWorker] Activate");
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  console.log(event.request.url);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// self.addEventListener("fetch", evt => {
//   console.log("[ServiceWorker] Fetch", evt.request.url);
//   // CODELAB: Add fetch event handler here.
//   if (evt.request.url.includes("/forecast/")) {
//     console.log("[Service Worker] Fetch (data)", evt.request.url);
//     evt.respondWith(
//       caches.open(DATA_CACHE_NAME).then(cache => {
//         return fetch(evt.request)
//           .then(response => {
//             // If the response was good, clone it and store it in the cache.
//             if (response.status === 200) {
//               cache.put(evt.request.url, response.clone());
//             }
//             return response;
//           })
//           .catch(err => {
//             // Network request failed, try to get it from the cache.
//             return cache.match(evt.request);
//           });
//       })
//     );
//     return;
//   }
//   evt.respondWith(
//     caches.open(CACHE_NAME).then(cache => {
//       return cache.match(evt.request).then(response => {
//         return response || fetch(evt.request);
//       });
//     })
//   );
// });
