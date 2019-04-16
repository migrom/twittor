// imports
importScripts('/cursopwaadvance/06-twittor/js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    '/cursopwaadvance/06-twittor/',
    '/cursopwaadvance/06-twittor/index.html',
    '/cursopwaadvance/06-twittor/css/style.css',
    '/cursopwaadvance/06-twittor/img/favicon.ico',
    '/cursopwaadvance/06-twittor/img/avatars/hulk.jpg',
    '/cursopwaadvance/06-twittor/img/avatars/ironman.jpg',
    '/cursopwaadvance/06-twittor/img/avatars/spiderman.jpg',
    '/cursopwaadvance/06-twittor/img/avatars/thor.jpg',
    '/cursopwaadvance/06-twittor/img/avatars/wolverine.jpg',
    '/cursopwaadvance/06-twittor/js/app.js',
    '/cursopwaadvance/06-twittor/js/sw-utils.js'
];


///cursopwaadvance/06-twittor/
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/cursopwaadvance/06-twittor/css/animate.css',
    '/cursopwaadvance/06-twittor/js/libs/jquery.js'
];

const APP_SHELL_DINAMIC = [
    'https://fonts.gstatic.com/s/quicksand/v9/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2',
    'https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjx4wXiWtFCc.woff2'
];

self.addEventListener('install', e =>{

    const cacheStatic = caches.open( STATIC_CACHE)
        .then( cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open( INMUTABLE_CACHE)
        .then( cache => {
            return cache.addAll(APP_SHELL_INMUTABLE)
        });


    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));

});

self.addEventListener('activate', e =>{

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if( key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

        });
    });

    e.waitUntil( respuesta );

});

self.addEventListener('fetch', e =>{

    const respuesta = caches.match(e.request).then( res => {

        if (res){
            return res;
        }else{
            return fetch(e.request).then( newRes => {
                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);
            });
        }

    });

    e.respondWith( respuesta );

});