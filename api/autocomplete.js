const axios = require('axios');

const PHOTON_URL = 'https://photon.komoot.io/api/';
const OWM_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';
const API_KEY = process.env.OPENWEATHER_API_KEY;

function getPlaceTypeScore(value) {
  switch (value) {
    case 'city': return 5;
    case 'town': return 4;
    case 'subdistrict': return 3;
    case 'district': return 3;
    case 'suburb': return 2;
    case 'village': return 1;
    default: return 0;
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(200).json([]);
  }

  const queryLower = q.toLowerCase().trim();

  try {
    // Query Photon API with a higher limit so we can filter and sort
    const response = await axios.get(PHOTON_URL, {
      params: {
        q: q.trim(),
        limit: 30,
        lang: 'en'
      },
      timeout: 6000,
      headers: {
        'User-Agent': 'WeatherNow-App/1.0',
      },
    });

    const features = response.data?.features || [];
    const seen = new Set();
    const suggestions = [];

    for (const f of features) {
      const p = f.properties || {};
      const name = p.name;
      const country = p.country || '';
      const countryCode = p.countrycode?.toUpperCase() || '';
      const state = p.state || '';
      const lat = f.geometry?.coordinates?.[1];
      const lon = f.geometry?.coordinates?.[0];

      if (!name || !lat || !lon) continue;

      // Filter only geographical place settlements (cities, towns, villages, etc.)
      // This filters out roads, shops, buildings, etc.
      if (p.osm_key !== 'place') continue;

      // Build a clean display string
      const parts = [name];
      if (state && state !== name) parts.push(state);
      if (country && country !== name) parts.push(country);
      const display = parts.join(', ');

      const key = display.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);

      const isPakistan = (countryCode === 'PK' || country.toLowerCase() === 'pakistan');

      suggestions.push({
        name,
        country: countryCode || country,
        state,
        display,
        lat,
        lon,
        isPakistan,
        osmValue: p.osm_value || ''
      });
    }

    // Sort: 
    // 1. Pakistan (PK) first
    // 2. Place type score (city > town > subdistrict > suburb > village)
    // 3. Prefix match on name
    suggestions.sort((a, b) => {
      if (a.isPakistan && !b.isPakistan) return -1;
      if (!a.isPakistan && b.isPakistan) return 1;

      const aType = getPlaceTypeScore(a.osmValue);
      const bType = getPlaceTypeScore(b.osmValue);
      if (aType !== bType) return bType - aType;

      const aStarts = a.name.toLowerCase().startsWith(queryLower);
      const bStarts = b.name.toLowerCase().startsWith(queryLower);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });

    return res.status(200).json(suggestions.slice(0, 6));
  } catch (photonErr) {
    // Fallback to OpenWeather geocoding if Photon is unavailable
    if (!API_KEY) return res.status(200).json([]);

    try {
      const owmRes = await axios.get(OWM_GEO_URL, {
        params: { q: q.trim(), limit: 15, appid: API_KEY },
        timeout: 6000,
      });

      const seen = new Set();
      const suggestions = [];

      for (const item of owmRes.data || []) {
        const name = item.name;
        const country = item.country;
        const state = item.state || '';
        const display = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`;
        const key = display.toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);

        const isPakistan = (country === 'PK' || country.toLowerCase() === 'pakistan');

        suggestions.push({
          name,
          country,
          state,
          display,
          isPakistan
        });
      }

      // Sort OWM fallback results by Pakistan first too
      suggestions.sort((a, b) => {
        if (a.isPakistan && !b.isPakistan) return -1;
        if (!a.isPakistan && b.isPakistan) return 1;
        return 0;
      });

      return res.status(200).json(suggestions.slice(0, 6));
    } catch {
      return res.status(200).json([]);
    }
  }
};
