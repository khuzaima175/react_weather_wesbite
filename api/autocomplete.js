const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json([]);
  }
  if (!API_KEY) {
    return res.status(500).json({ message: 'Server configuration error' });
  }

  try {
    const response = await axios.get(GEO_URL, {
      params: { q: q.trim(), limit: 15, appid: API_KEY },
      timeout: 8000,
    });

    const seen = new Set();
    const suggestions = [];

    for (const item of response.data) {
      const name = item.name;
      const country = item.country;
      const state = item.state || '';
      const display = state
        ? `${name}, ${state}, ${country}`
        : `${name}, ${country}`;

      const key = display.toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        suggestions.push({ name, country, state, display });
      }
    }

    return res.status(200).json(suggestions.slice(0, 6));
  } catch (err) {
    return res.status(500).json([]);
  }
};
