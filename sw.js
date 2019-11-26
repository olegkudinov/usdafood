const version = 6;
const staticCacheName = 'sitecache-static' + version;
const dynamicCacheName = 'sitecache-dynamic' + version;

const assets = [
    "https://use.fontawesome.com/releases/v5.7.1/css/all.css",
    "https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic",
    "https://cdn.rawgit.com/necolas/normalize.css/master/normalize.css",
    "https://cdn.rawgit.com/milligram/milligram/master/dist/milligram.min.css",
    "/usdafood/",
    "/usdafood/index.html",
    "/usdafood/fallback.html",
    "/usdafood/css/index.css",
    "/usdafood/js/underscore-min.js",
    "/usdafood/js/request.js",
    "/usdafood/js/formatter.js",
    "/usdafood/js/app.js"
];

const limitCache = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {        
            if(keys.length > size) {
                cache.delete(keys[0]).then(
                  limitCache(name, size));
            }
        });
    });
};

let openCaches = () => caches.open(staticCacheName).then(cache => {
    console.log('caching shell assets');
    cache.addAll(assets);
});    

let removeObsolete = () => caches.keys().then(keys => {
    //console.log(keys);
    return Promise.all(keys
      .filter(key => key !== staticCacheName && key !== dynamicCacheName)
      .map(key => caches.delete(key)));
});      
    

self.addEventListener('install', evt => {
    console.log('sw is installed', evt);
    evt.waitUntil(openCaches());
});

self.addEventListener('activate', evt => {
    console.log('sw is activated', evt);
    evt.waitUntil(removeObsolete());
});

self.addEventListener('fetch', evt => {
    console.log('url is requesed ', evt);
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
          caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(async fetchRes => {
              const cache = await caches.open(dynamicCacheName);
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCache(dynamicCacheName, 15);
                return fetchRes;
            });
          }).catch(() => {
            if(evt.request.url.indexOf('.html') > -1){
              return caches.match('/usdafood/fallback.html');
            } 
          })
        );
      }
});