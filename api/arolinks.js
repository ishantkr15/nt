export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  const token = 'c9f2a208dc34c5a01ff3653a8070ce998a3103fe';
  const apiCall = `https://arolinks.com/api?api=${token}&url=${encodeURIComponent(url)}`;
  
  try {
    const fetchRes = await fetch(apiCall);
    const data = await fetchRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
