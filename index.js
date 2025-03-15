addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  // Get the station identifier from the query parameters (default to 'unity')
  const station = url.searchParams.get('station') || 'unity'
  
  // Map station IDs to stream URLs
  const stations = {
    unity: "http://icecast.commedia.org.uk:8000/unity.mp3",
    heartFM: "https://media-ssl.musicradio.com/HeartUK",
    heart: "http://ice-the.musicradio.com:80/HeartUKMP3",
    heartMP3: "http://icecast.thisisdax.com/HeartUKMP3.m3u",
    heart80s: "http://media-the.musicradio.com:80/Heart80sMP3"
  }
  
  const targetUrl = stations[station]
  if (!targetUrl) {
    return new Response("Station not found", { status: 404 })
  }
  
  // Create a new request for the target URL, copying method and headers if necessary.
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow'
  })

  const response = await fetch(modifiedRequest)
  const newHeaders = new Headers(response.headers)
  newHeaders.set("Access-Control-Allow-Origin", "*") // allow CORS if needed
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
