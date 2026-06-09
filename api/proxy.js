export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { path } = req.query; // pass path as query param, e.g. ?path=/nt/course-details
    if (!path) {
      return res.status(400).json({ success: false, message: 'Path required' });
    }

    const targetUrl = `https://1api.notjitu.workers.dev${path}`;

    // Pass along query parameters other than 'path'
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'path') {
        queryParams.append(key, value);
      }
    }
    
    const finalUrl = queryParams.toString() ? `${targetUrl}?${queryParams.toString()}` : targetUrl;

    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://www.notjitu.in',
        'Referer': 'https://www.notjitu.in/'
      }
    };

    if (req.method === 'POST') {
      options.body = JSON.stringify(req.body);
    }

    const fetchRes = await fetch(finalUrl, options);
    
    // We get JSON response back from notjitu
    const data = await fetchRes.text();
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = { success: false, raw: data };
    }

    res.status(fetchRes.status).json(parsedData);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
