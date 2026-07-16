// TraveLog 서비스워커
// 앱 자체 파일(HTML/매니페스트/아이콘)은 캐시해서 오프라인에서도 열리게 하고,
// 지도(카카오/구글)나 Supabase 같은 외부 요청은 그대로 네트워크로 보냅니다.
// (지도 자체는 인터넷이 있어야만 그려지지만, 왼쪽 장소 목록은 오프라인에서도 보여요.)
 
const CACHE_NAME = 'travelog-v2';
const APP_SHELL = [
  'travel-pin-map.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
  'icon-512-maskable.png'
];
 
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .catch(()=>{})
  );
  self.skipWaiting();
});
 
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});
 
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isAppShellFile = APP_SHELL.some(path => req.url.endsWith(path));
 
  if(isAppShellFile){
    // 우리 앱 파일: 캐시 우선 → 실패하면 네트워크
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req))
    );
    return;
  }
 
  // 그 외(지도 SDK, Supabase 등): 네트워크 우선 → 실패하면 캐시(있으면)
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
 
