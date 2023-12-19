'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "d31c57a6e5e094ba2cbe2d15d567f4cc",
"index.html": "350a952e420b68e8da22dda21fbff962",
"/": "350a952e420b68e8da22dda21fbff962",
"main.dart.js": "0a9fefa10701cc573d04e5761b3e2685",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "c1d8a3139c8cd5c82e2c163d7915d997",
"assets/AssetManifest.json": "2821dba98abb0ecbf4e099f981bbe6d1",
"assets/NOTICES": "84add7a5dc24c997da9f39a5739a16fc",
"assets/FontManifest.json": "d8280c65d2d02aeb5e3a03587618f776",
"assets/AssetManifest.bin.json": "40573a1f0a095ecf7c4b423904b18f71",
"assets/packages/fluentui_system_icons/fonts/FluentSystemIcons-Filled.ttf": "8385e1b09307b2d6a613a0275adc586e",
"assets/packages/fluentui_system_icons/fonts/FluentSystemIcons-Regular.ttf": "04614b535fe6879ea13a8e07fd6754de",
"assets/packages/geekyants_flutter_gauges/assets/fonts/Roboto-Regular.ttf": "8a36205bd9b83e03af0591a004bc97f4",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "b12675d6d29de40ae00990785b371473",
"assets/fonts/pretendard/Pretendard-Regular.otf": "84c0ea9d65324c758c8bd9686207afea",
"assets/fonts/pretendard/Pretendard-Black.otf": "de507f665f6ea63a94678e529b2a4ff0",
"assets/fonts/pretendard/Pretendard-Medium.otf": "13a352bd44156de92cce335ce93cd02d",
"assets/fonts/pretendard/Pretendard-Light.otf": "de308b576c70af4871d436e89918fdf6",
"assets/fonts/pretendard/Pretendard-ExtraBold.otf": "67e8e4773c05f2988c52dfe6ea337f33",
"assets/fonts/pretendard/Pretendard-Bold.otf": "f8a9b84216af5155ffe0e8661203f36f",
"assets/fonts/pretendard/Pretendard-Thin.otf": "32c8b7e405cd546866e5ef1d33179cba",
"assets/fonts/pretendard/Pretendard-ExtraLight.otf": "049bb07edff45e5817fa4f892ebabe98",
"assets/fonts/pretendard/Pretendard-SemiBold.otf": "6fe301765c4f438e2034a0a47b609c61",
"assets/fonts/suit/SUIT-Thin.otf": "30b0c7a66fef7ff65c5f7fb75105c822",
"assets/fonts/suit/SUIT-Regular.otf": "c64dd0920635db98357e82fc437933b8",
"assets/fonts/suit/SUIT-Heavy.otf": "c185fbd9f94aac11af0702c842156834",
"assets/fonts/suit/SUIT-Bold.otf": "d0cdff414c026a996fe8a001e45abc25",
"assets/fonts/suit/SUIT-Light.otf": "fe4ce81a5131425eacc9707fbd1496be",
"assets/fonts/suit/SUIT-ExtraLight.otf": "893ffa6d7fc521de54c58974ca60baa0",
"assets/fonts/suit/SUIT-SemiBold.otf": "58b32c46668003ddb73d39cc5d8489dc",
"assets/fonts/suit/SUIT-Medium.otf": "629b4023e1325b39deedbbb611cc0de8",
"assets/fonts/suit/SUIT-ExtraBold.otf": "847b6b892be1bf01c680c3f457fe8664",
"assets/fonts/MaterialIcons-Regular.otf": "d1948c18558789467b6a6dede4f1f390",
"assets/assets/images/laboratory.jpg": "c2044c1e4f8c2d117e19d098e8c4b0df",
"assets/assets/svgs/seawith_logo.svg": "560c184c69126d4b4ff66df57aabd9ab",
"assets/assets/svgs/seawith_favicon.svg": "0d80de8a60eba1ee59073a8bdb852658",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "4124c42a73efa7eb886d3400a1ed7a06",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "f87e541501c96012c252942b6b75d1ea",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "64edb91684bdb3b879812ba2e48dd487",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
