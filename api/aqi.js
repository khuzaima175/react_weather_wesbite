const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ message: 'Coordinates are required' });
    }
    if (!API_KEY) {
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: { lat, lon, appid: API_KEY },
            timeout: 10000
        });
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch air quality data.' });
    }
};
