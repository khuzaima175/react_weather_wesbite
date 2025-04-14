// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios import for FRONTEND (separate from backend)
import './App.css'; // We'll add styles here

// --- Configuration (No API Key Here!) ---
const DEFAULT_CITY = "Karachi";
const UNITS = "metric"; // 'metric' for Celsius, 'imperial' for Fahrenheit
const TEMP_UNIT_SYMBOL = UNITS === "metric" ? "°C" : "°F";
const ICON_BASE_URL = "http://openweathermap.org/img/wn/"; // Base URL for icons from OpenWeatherMap

function App() {
    // --- State Variables ---
    const [cityInput, setCityInput] = useState(DEFAULT_CITY);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayCity, setDisplayCity] = useState('');

    // --- Fetch Weather Data Function ---
    // Calls YOUR backend endpoint (/api/weather)
    const fetchWeather = async (cityToFetch) => {
        if (!cityToFetch) {
            setError("Please enter a city name.");
            return;
        }

        setIsLoading(true);
        setError('');
        setWeatherData(null);

        try {
            console.log(`Calling /api/weather for city: ${cityToFetch}`);
            const response = await axios.get(`/api/weather`, {
                params: {
                    city: cityToFetch,
                    units: UNITS
                },
                timeout: 15000 // 15 seconds timeout
            });

            console.log("Received data from /api/weather:", response.data);
            setWeatherData(response.data);
            setDisplayCity(response.data.name);
            setError('');

        } catch (err) {
            console.error("Error calling /api/weather:", err);
            if (err.response) {
                // Use the 'message' field from the JSON error response sent by your function
                setError(err.response.data.message || `Error: ${err.response.status}`);
            } else if (err.request) {
                setError("Network Error: Could not connect to the service.");
            } else {
                setError(`Request failed: ${err.message}`);
            }
            setWeatherData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // --- useEffect Hook ---
    useEffect(() => {
        fetchWeather(DEFAULT_CITY);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Event Handlers ---
    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeather(cityInput);
    };

    // --- Helper Functions ---
    const formatDateTime = (dtUnix, timezoneOffsetSeconds) => {
        if (!dtUnix || timezoneOffsetSeconds === undefined) return "Time/Date N/A";
        try {
            const date = new Date((dtUnix + timezoneOffsetSeconds) * 1000);
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' };
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
            const timeString = date.toLocaleTimeString('en-US', timeOptions);
            const dateString = date.toLocaleDateString('en-US', dateOptions);
            return `${timeString} | ${dateString}`;
        } catch (e) {
            console.error("Error formatting date:", e);
            return "Time/Date N/A";
        }
    };

    // --- JSX Rendering ---
    return (
        <div className="app-container">
            <form onSubmit={handleSubmit} className="input-section">
                <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter city name"
                    className="city-input"
                    disabled={isLoading}
                />
                <button type="submit" className="fetch-button" disabled={isLoading}>
                    {isLoading ? "..." : "Get Weather"}
                </button>
            </form>

            <div className="display-section">
                {isLoading && <p className="loading-message">Fetching weather data...</p>}
                {error && !isLoading && <p className="error-message">{error}</p>}
                {weatherData && !isLoading && !error && (
                    <div className="weather-details">
                        {weatherData.weather?.[0]?.icon && (
                            <img
                                src={`${ICON_BASE_URL}${weatherData.weather[0].icon}@4x.png`}
                                alt={weatherData.weather[0].description}
                                className="weather-icon"
                            />
                        )}
                        <h2 className="city-name">
                            {displayCity}, {weatherData.sys?.country}
                        </h2>
                        <p className="temperature">
                            {weatherData.main?.temp?.toFixed(1)}{TEMP_UNIT_SYMBOL}
                        </p>
                        {weatherData.weather?.[0]?.description && (
                           <p className="description">{weatherData.weather[0].description}</p>
                        )}
                        <div className="details-grid">
                             <p className="feels-like">
                                Feels Like: {weatherData.main?.feels_like?.toFixed(1)}{TEMP_UNIT_SYMBOL}
                            </p>
                            <p className="humidity">
                                Humidity: {weatherData.main?.humidity}%
                             </p>
                        </div>
                        <p className="datetime">
                            {formatDateTime(weatherData.dt, weatherData.timezone)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;