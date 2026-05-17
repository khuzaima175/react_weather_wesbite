const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { city, lat, lon, units } = req.query;

    if (!city && (!lat || !lon)) {
        return res.status(400).json({ message: 'City or coordinates are required' });
    }
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error' });
    }

    const params = { appid: API_KEY, units: units || 'metric', cnt: 40 };
    if (city) params.q = city;
    else { params.lat = lat; params.lon = lon; }

    try {
        const response = await axios.get(BASE_URL, { params, timeout: 10000 });
        return res.status(200).json(response.data);
    } catch (error) {
        let statusCode = 500;
        let message = 'Failed to fetch forecast data.';
        if (error.response) {
            statusCode = error.response.status;
            message = error.response.data?.message || `Error (${statusCode})`;
            if (statusCode === 404) message = `City '${city}' not found.`;
        }
        return res.status(statusCode).json({ message });
    }
};
