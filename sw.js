// TraveLog 최소 서비스워커
// 앱이 "설치 가능"하려면 서비스워커가 하나 있어야 해요.
// 카카오맵/서버 데이터는 항상 최신으로 받아야 하므로 별도 캐싱은 하지 않고,
// 그냥 네트워크 요청을 그대로 통과시켜줍니다.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
