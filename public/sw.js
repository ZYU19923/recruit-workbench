const CACHE_NAME = 'recruit-workbench-v1'
const PRECACHE_URLS = ['/', '/jobs', '/candidates', '/analytics', '/todos', '/settings']

self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event: any) => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then(
      (cached) => cached || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('/')
        return new Response('', { status: 503 })
      })
    )
  )
})
