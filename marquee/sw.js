const currentCache="20.20.1901"
self.addEventListener("install",e=>{
	self.skipWaiting()
	e.waitUntil(caches.open(currentCache).then(cache=>{
		return cache.addAll([
			"./",
			"byte",
			"calculator",
			"cordova.js",
			"currency",
			"date",
			"equation12",
			"equation21",
			"equation31",
			"favicon.ico",
			"feedback",
			"findlinearfunction",
			"findquadraticfunction",
			"flashcard",
			"manifest.json",
			"marquee",
			"mole",
			"numberbase",
			"quadraticfunction",
			"randomnumber",
			"statistics",
			"texteditor",
			"textencoder",
			"timer",
			"translate",
			"wordlist",
			"css/general.css",
			"css/home.css",
			"js/byte.js",
			"js/calculator.js",
			"js/currency.js",
			"js/date.js",
			"js/equation12.js",
			"js/equation21.js",
			"js/equation31.js",
			"js/feedback.js",
			"js/findlinearfunction.js",
			"js/findquadraticfunction.js",
			"js/flashcard.js",
			"js/general.js",
			"js/home.js",
			"js/i18n.js",
			"js/marquee.js",
			"js/mole.js",
			"js/numberbase.js",
			"js/quadraticfunction.js",
			"js/randomnumber.js",
			"js/statistics.js",
			"js/texteditor.js",
			"js/textencoder.js",
			"js/timer.js",
			"js/translate.js",
			"js/wordlist.js",
			"fonts/mui.ttf",
			"vendor/md5.min.js",
			"vendor/mui.min.css",
			"vendor/qrcode.min.js",
			"vendor/vue.min.js",
			"vendor/waves.min.css",
			"vendor/waves.min.js"
		])
	}))
})
self.addEventListener("fetch",e=>{
	e.respondWith(caches.match(e.request).then(response=>{
		return response||fetch(e.request).catch(()=>{})
	}).then(data=>{
		return data||new Response(null,{
			status: 502,
			statusText: "Bad Gateway"
		})
	}))
})
self.addEventListener("activate",e=>{
	e.waitUntil(caches.keys().then(cacheNames=>{
		return Promise.all(cacheNames.map(cacheName=>{
			if(cacheName!=currentCache){
				return caches.delete(cacheName)
			}
		}))
	}))
})
