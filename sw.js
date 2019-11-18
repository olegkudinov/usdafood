self.addEventListener('install', evt => {
    console.log('sw is installed', evt);
});

self.addEventListener('activate', evt => {
    console.log('sw is activated', evt);
});

self.addEventListener('fetch', evt => {
    console.log('url is requesed ', evt);
});