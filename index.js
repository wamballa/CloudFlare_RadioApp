addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // The target HTTP stream URL
  const targetUrl = 'http://icecast.commedia.org.uk:8000/unity.mp3'
  
  // Create a new request for the target URL, copying the original method and headers if needed.
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    redirect: 'follow'
  });
  
  // Fetch the stream from the target URL
  const response = await fetch(modifiedRequest);
  
  // Create new headers, adding CORS if needed
  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*'); // Optional: allow all origins

  // Return the response from the target URL, now served over HTTPS
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
