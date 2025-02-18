const BASE_PATH = "http://localhost"
const NO_STORE = ["http://localhost:3000"]

self.addEventListener('install', (event)=>{
    self.skipWaiting()
})

self.addEventListener('fetch', (event)=>{
    event.respondWith(
      caches.match(event.request).then(async (cachedResponse) => {
        //Attempt to fetch data
        try{
          const response = await fetch(event.request)
          if (event.request.method === 'GET' && response.ok) {
            await caches.open('my-cache').then((cache) => {
              for (const forbidden of NO_STORE){
                if(event.request.url.startsWith(forbidden)) return
              }
              if(event.request.url.startsWith(BASE_PATH)) cache.put(event.request, response.clone());
            });
          }
          return response;
        }
        catch{
          //Check for potentially stale data as fallback
          if (cachedResponse) {
            return cachedResponse;
          }
          //Display default fallback response if fetch fails
          return new Response(/*html*/`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Offline</title>
            </head>
            <body>
                    <h1>You appear to be offline</h1>
                <style>
                    body{
                        display: flex;
                        min-height: 100vh;
                        justify-content: center;
                        align-items: center;
                    }
                </style>
            </body>
            </html>
            `, {
            headers: {'Content-Type': 'text/html'}
            }
          )
        };
      })
    )
})