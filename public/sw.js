// Self-removing service worker.
//
// This site does not use a service worker. This file exists for browsers that
// still have one registered for this origin from something else — in practice,
// another project that was run on the same localhost port. Service workers are
// scoped to scheme + host + port, not to a project, so a worker left behind on
// http://localhost:3000 keeps answering requests for whatever app is served
// there next. If that worker caches /_next/static/ cache-first, it hands the old
// app's chunks to this one and the page dies on load with errors like
// "Cannot read properties of undefined (reading 'call')".
//
// Browsers re-fetch the registered worker script on every navigation. When they
// find this file at that URL it replaces the stale worker, drops its caches,
// unregisters, and reloads any open tabs so they come back uncontrolled.
//
// Nothing here registers it, so on a browser with no worker it never runs.

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(cacheNames.map((name) => caches.delete(name)))
      await self.registration.unregister()

      const windows = await self.clients.matchAll({ type: 'window' })
      await Promise.all(windows.map((client) => client.navigate(client.url).catch(() => {})))
    })()
  )
})
