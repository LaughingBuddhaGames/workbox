/* global workbox */

importScripts('/__test/bundle/workbox-routing');

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const routes = [];

routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.endsWith('static'),
  handler: () => Promise.resolve(new Response('static response')),
}));

routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.endsWith('method/put'),
  handler: () => Promise.resolve(new Response('put response')),
  method: 'PUT',
}));

// Explicitly test the `handler: Object.handle` syntax here.
routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.endsWith('echobody'),
  handler: {
    handle: ({event}) => event.request.text().then((txt) => new Response(txt)),
  },
  method: 'POST',
}));

routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.match(
    new RegExp('/echo3/1st/(\\w+)/2nd/(\\w+)/3rd/(\\w+)')),
  handler: ({params}) => Promise.resolve(new Response(
    JSON.stringify(params.slice(1)), {
      headers: {'content-type': 'application/json'},
    })
  ),
}));

const router = new workbox.routing.Router();
router.addFetchListener();
router.registerRoutes({routes});
