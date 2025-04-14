import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Make sure './App.css' import is removed if using Bootstrap primarily

// --- Configuration (No API Key Here!) ---
const DEFAULT_CITY = "Karachi";
const UNITS = "metric"; // 'metric' for Celsius, 'imperial' for Fahrenheit
const TEMP_UNIT_SYMBOL = UNITS === "metric" ? "°C" : "°F";
const ICON_BASE_URL = "http://openweathermap.org/img/wn/"; // Base URL for icons from OpenWeatherMap

function App() {
    // --- State Variables ---
    const [cityInput, setCityInput] = useState(DEFAULT_CITY); // Input field value
    const [weatherData, setWeatherData] = useState(null);     // Stores successful API response data
    const [error, setError] = useState('');                   // Stores error messages for display
    const [isLoading, setIsLoading] = useState(false);        // Tracks if an API call is in progress
    const [displayCity, setDisplayCity] = useState('');       // City name shown in UI (from API response)

    // --- Fetch Weather Data Function ---
    // This function calls YOUR backend endpoint (/api/weather) - Keep as is
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
                timeout: 15000 // Optional: Add a timeout (15 seconds)
            });

            console.log("Received data from /api/weather:", response.data);
            setWeatherData(response.data);
            setDisplayCity(response.data.name);
            setError('');

        } catch (err) {
            console.error("Error calling /api/weather:", err);
            if (err.response) {
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
    // Runs once when the component first mounts - Keep as is
    useEffect(() => {
        fetchWeather(DEFAULT_CITY);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Event Handlers ---
    // Handles form submission - Keep as is
    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeather(cityInput);
    };

    // --- Helper Functions ---
    // Formats the Unix timestamp and timezone offset - Keep as is
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

    // --- JSX Rendering (Using Bootstrap Classes) ---
    return (
        // Main container - Bootstrap class for responsive max-width and padding
        // Added 'vh-100 d-flex flex-column' to try and center vertically better if needed
        <div className="container mt-3" style={{ maxWidth: '450px' }}>

            {/* Input Form Section */}
            {/* Using Bootstrap bg, padding, rounded corners, margin bottom */}
            <form onSubmit={handleSubmit} className="bg-secondary p-3 rounded mb-4 shadow-sm">
              {/* Bootstrap row with gutters (spacing) and vertical alignment */}
              <div className="row g-2 align-items-center">
                {/* Column for input: full width on smallest screens, auto width on small+ */}
                <div className="col-12 col-sm">
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter city name"
                    className="form-control form-control-lg bg-dark text-light border-secondary" // Bootstrap styled input, large size, dark theme
                    disabled={isLoading}
                    aria-label="City Name"
                  />
                </div>
                {/* Column for button: full width on smallest screens, auto width on small+ */}
                <div className="col-12 col-sm-auto">
                  <button
                    type="submit"
                    // Bootstrap button, primary color, large size, full width on mobile
                    className="btn btn-primary btn-lg w-100 w-sm-auto"
                    disabled={isLoading}
                  >
                    {/* Show spinner when loading */}
                    {isLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        "Get Weather"
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Weather Display Section */}
            {/* Using Bootstrap card, dark theme, text alignment, minimum height */}
            <div className="card bg-dark text-light text-center shadow" style={{ minHeight: '350px' }}>
              <div className="card-body d-flex flex-column justify-content-center align-items-center"> {/* Use flex to center content vertically */}
                  {/* Loading State */}
                  {isLoading && (
                    <div>
                        <div className="spinner-border text-info mb-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-info">Fetching weather data...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && !isLoading && <p className="text-danger fw-bold fs-5">{error}</p>}

                  {/* Success State */}
                  {weatherData && !isLoading && !error && (
                      <div className="weather-details w-100"> {/* Ensure details take width */}
                          {/* Weather Icon */}
                          {weatherData.weather?.[0]?.icon && (
                              <img
                                  src={`${ICON_BASE_URL}${weatherData.weather[0].icon}@4x.png`}
                                  alt={weatherData.weather[0].description}
                                  className="mb-2 mx-auto d-block" // Bootstrap margin bottom, center horizontally
                                  style={{ width: '128px', height: '128px' }} // Keep size
                              />
                          )}

                          {/* City Name */}
                          <h2 className="city-name h3 mb-1"> {/* Bootstrap heading size, margin */}
                              {displayCity}, {weatherData.sys?.country}
                          </h2>

                          {/* Temperature */}
                           {/* Bootstrap display heading size, bold, warning color */}
                          <p className="temperature display-3 fw-bold text-warning my-1">
                              {weatherData.main?.temp?.toFixed(1)}{TEMP_UNIT_SYMBOL}
                          </p>

                          {/* Description */}
                          {weatherData.weather?.[0]?.description && (
                             <p className="description text-capitalize fs-5 mb-3">{weatherData.weather[0].description}</p>
                          )}

                          {/* Feels Like & Humidity */}
                           {/* Using Bootstrap flex utilities for layout */}
                          <div className="d-flex justify-content-center gap-4 mb-3 fs-6">
                               <p className="feels-like mb-0">
                                  Feels Like: {weatherData.main?.feels_like?.toFixed(1)}{TEMP_UNIT_SYMBOL}
                              </p>
                              <p className="humidity mb-0">
                                  Humidity: {weatherData.main?.humidity}%
                               </p>
                          </div>

                          {/* Date & Time */}
                          <p className="datetime text-info-emphasis mt-2 fs-sm"> {/* Bootstrap text color, margin top, small font */}
                              {formatDateTime(weatherData.dt, weatherData.timezone)}
                          </p>
                      </div>
                  )}
              </div> {/* End card-body */}
            </div> {/* End card */}
        </div> // End container
    );
}

export default App;