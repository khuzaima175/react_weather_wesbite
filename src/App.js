import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherStats from './components/WeatherStats';
import SunArc from './components/SunArc';
import AQICard from './components/AQICard';
import WeatherBackground from './components/WeatherBackground';
import WeatherSkeleton from './components/WeatherSkeleton';
import { getBgClass, isNighttime } from './utils/weatherUtils';

const DEFAULT_CITY = 'Karachi';
const AUTO_REFRESH_MS = 10 * 60 * 1000; // 10 minutes

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('wn-theme') || 'dark');
  const [units, setUnits] = useState(() => localStorage.getItem('wn-units') || 'metric');
  const [lowPerf, setLowPerf] = useState(true);
  const [cityInput, setCityInput] = useState(DEFAULT_CITY);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wn-history') || '[]'); }
    catch { return []; }
  });

  // Keep a ref to the current city so the auto-refresh interval can access it
  const currentCityRef = useRef(DEFAULT_CITY);

  const fetchAll = useCallback(async (city, unitSys) => {
    const u = unitSys || units;
    if (!city?.trim()) { setError('Please enter a city name.'); return; }
    setIsLoading(true);
    setError('');

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get('/api/weather', { params: { city, units: u }, timeout: 15000 }),
        axios.get('/api/forecast', { params: { city, units: u }, timeout: 15000 }),
      ]);

      setCurrentWeather(weatherRes.data);
      setForecast(forecastRes.data);
      setCityInput(weatherRes.data.name);
      setLastUpdated(Date.now());
      currentCityRef.current = weatherRes.data.name;

      const { lat, lon } = weatherRes.data.coord;
      axios.get('/api/aqi', { params: { lat, lon }, timeout: 15000 })
        .then(r => setAqi(r.data))
        .catch(() => setAqi(null));

      const city_ = weatherRes.data.name;
      setSearchHistory(prev => {
        const next = [city_, ...prev.filter(h => h.toLowerCase() !== city_.toLowerCase())].slice(0, 6);
        localStorage.setItem('wn-history', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      if (err.response) setError(err.response.data?.message || `Error ${err.response.status}`);
      else if (err.request) setError('Network error — check your connection.');
      else setError(err.message);
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, [units]);

  // Initial load
  useEffect(() => { fetchAll(DEFAULT_CITY); }, []); // eslint-disable-line

  // Auto-refresh every 10 minutes when the tab is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && currentCityRef.current) {
        fetchAll(currentCityRef.current);
      }
    }, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wn-theme', theme);
  }, [theme]);

  const handleUnitToggle = () => {
    const next = units === 'metric' ? 'imperial' : 'metric';
    setUnits(next);
    localStorage.setItem('wn-units', next);
    if (currentWeather) fetchAll(currentWeather.name, next);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
    setIsLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lon } }) => {
        try {
          const res = await axios.get('/api/weather', { params: { lat, lon, units }, timeout: 15000 });
          fetchAll(res.data.name);
        } catch { setError('Could not fetch weather for your location.'); setIsLoading(false); }
      },
      () => { setError('Location access denied.'); setIsLoading(false); }
    );
  };

  const condition = currentWeather?.weather?.[0]?.main || '';
  const night = currentWeather
    ? isNighttime(currentWeather.dt, currentWeather.sys.sunrise, currentWeather.sys.sunset)
    : false;
  const bgClass = getBgClass(condition, night);

  return (
    <div className={`app ${bgClass} ${lowPerf ? 'low-perf' : ''}`} data-theme={theme}>
      <WeatherBackground condition={condition} isNight={night} lowPerf={lowPerf} />

      <div className="app-overlay" />

      <div className="app-content">
        {/* ── Header ── */}
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">🌤️</span>
            <span className="logo-text">WeatherNow</span>
          </div>
          <div className="header-controls">
            <button
              className="ctrl-btn unit-btn"
              onClick={handleUnitToggle}
              title="Toggle temperature unit"
              id="unit-toggle-btn"
            >
              <span className={units === 'metric' ? 'unit-active' : ''}>°C</span>
              <span className="unit-sep">/</span>
              <span className={units === 'imperial' ? 'unit-active' : ''}>°F</span>
            </button>
            <button
              className={`ctrl-btn theme-btn ${lowPerf ? 'low-perf-active' : ''}`}
              onClick={() => {
                const next = !lowPerf;
                setLowPerf(next);
                localStorage.setItem('wn-lowperf', next);
              }}
              title={lowPerf ? 'Battery Saver ON — click to disable' : 'Enable Battery Saver mode'}
              id="low-perf-toggle-btn"
              aria-label="Toggle low performance mode"
            >
              ⚡
            </button>
            <button
              className="ctrl-btn theme-btn"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              id="theme-toggle-btn"
              aria-label="Toggle dark/light mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* ── Search ── */}
        <SearchBar
          value={cityInput}
          onChange={setCityInput}
          onSearch={(query) => fetchAll(query)}
          onGeolocate={handleGeolocate}
          searchHistory={searchHistory}
          isLoading={isLoading}
        />

        {/* ── Error Banner ── */}
        {error && (
          <div className="error-banner" role="alert">
            <span>⚠️ {error}</span>
            <button className="error-close" onClick={() => setError('')}>✕</button>
          </div>
        )}

        {/* ── Loading (first load) ── */}
        {isLoading && !currentWeather && <WeatherSkeleton />}

        {/* ── Weather Content ── */}
        {currentWeather && (
          <main className="weather-content">
            <CurrentWeather
              data={currentWeather}
              units={units}
              isLoading={isLoading}
              lastUpdated={lastUpdated}
            />

            {forecast && (
              <HourlyForecast
                data={forecast.list.slice(0, 8)}
                units={units}
                timezone={currentWeather.timezone}
              />
            )}

            <div className="bottom-grid">
              {forecast && (
                <DailyForecast
                  data={forecast.list}
                  units={units}
                  timezone={currentWeather.timezone}
                />
              )}
              <WeatherStats data={currentWeather} units={units} />
              <SunArc
                sunrise={currentWeather.sys.sunrise}
                sunset={currentWeather.sys.sunset}
                current={currentWeather.dt}
                timezone={currentWeather.timezone}
              />
              {aqi && <AQICard data={aqi} />}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default App;