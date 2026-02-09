export default async function handler(req, res) {
  // This code runs on Vercel's server, bypassing browser CORS/Mixed Content
  try {
    const response = await fetch('http://swiftstats.infinityfreeapp.com/backend/get_stats.php', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to reach InfinityFree" });
  }
}