// Filename: /api/weather.js
const axios = require('axios'); // Use require for robustness in serverless

// Load the API key securely from environment variables (set in Vercel)
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

module.exports = async (req, res) => { // Use module.exports for Vercel default
    // Get query parameters passed from the frontend (?city=...&units=...)
    const { city, units } = req.query;

    // Basic validation
    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }

    if (!API_KEY) {
        console.error("Server Error: OPENWEATHER_API_KEY environment variable not set.");
        return res.status(500).json({ message: 'Server configuration error' });
    }

    const params = {
        q: city,
        appid: API_KEY, // Securely added on the server-side
        units: units || 'metric', // Default to metric if not provided
    };

    try {
        console.log(`(API Function) Fetching weather for city: ${city}`);
        const response = await axios.get(BASE_URL, { params, timeout: 10000 });

        console.log(`(API Function) Successfully fetched weather for ${city}`);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error("(API Function) OpenWeatherMap API Error:", error.response?.data || error.message);
        let statusCode = 500;
        let message = 'Failed to fetch weather data from OpenWeatherMap.';

        if (error.response) {
            statusCode = error.response.status;
            message = error.response.data?.message || `OpenWeatherMap Error (${statusCode})`;
            if (statusCode === 401) message = "Invalid API Key provided by server.";
            if (statusCode === 404) message = `City '${decodeURIComponent(city)}' not found by OpenWeatherMap.`;
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
            message = "Request to OpenWeatherMap timed out.";
            statusCode = 504;
        }

        return res.status(statusCode).json({ message: message });
    }
};