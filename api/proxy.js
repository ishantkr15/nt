export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get('path');

    if (!path) {
      return new Response(JSON.stringify({ success: false, message: 'Path required' }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const targetUrl = new URL(`https://1api.notjitu.workers.dev${path}`);
    
    // Copy all other search params
    url.searchParams.forEach((value, key) => {
      if (key !== 'path') {
        targetUrl.searchParams.append(key, value);
      }
    });

    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    headers.set('Origin', 'https://www.notjitu.in');
    headers.set('Referer', 'https://www.notjitu.in/');

    const options = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = req.body; // Pipe the stream directly
    }

    const fetchRes = await fetch(targetUrl.toString(), options);
    
    // Copy response headers and inject CORS
    const responseHeaders = new Headers(fetchRes.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    
    return new Response(fetchRes.body, {
      status: fetchRes.status,
      statusText: fetchRes.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
