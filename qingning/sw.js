const currentCache = Date.now();
self.addEventListener("install", e => {
	self.skipWaiting();
	e.waitUntil(caches.open(currentCache).then(cache => cache.addAll([
		"./",
		"static/log-e8203cc878.css",
		"static/main-866fb9c7d3.css",
		"static/dark-e96d4e431b.js",
		"static/log-b4b99cb9d7.js",
		"static/main-2a79e5ffc0.js"
	])));
});
self.addEventListener("fetch", e => {
	e.respondWith(caches.match(e.request).then(response => {
		return response || fetch(e.request).catch(() => { });
	}).then(data => {
		return data || new Response(null, {
			status: 502,
			statusText: "Bad Gateway"
		});
	}));
});
self.addEventListener("activate", e => {
	e.waitUntil(caches.keys().then(cacheNames => {
		return Promise.all(cacheNames.map(cacheName => {
			if (cacheName != currentCache) {
				return caches.delete(cacheName);
			}
		}));
	}));
});
