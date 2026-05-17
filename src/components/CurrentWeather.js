import React from 'react';
import { getWeatherIcon, formatTemp, formatTime, formatWind, getWindDirection } from '../utils/weatherUtils';

function CurrentWeather({ data, units, isLoading }) {
  if (!data) return null;

  const condition = data.weather?.[0]?.main || '';
  const description = data.weather?.[0]?.description || '';
  const isNight = data.dt < data.sys.sunrise || data.dt > data.sys.sunset;
  const icon = getWeatherIcon(condition, isNight);
  const tz = data.timezone;

  return (
    <div className={`current-weather-card ${isLoading ? 'refreshing' : ''}`} id="current-weather">
      <div className="cw-top">
        <div className="cw-location">
          <h1 className="cw-city">
            <span className="location-pin">📍</span>
            {data.name}
            {data.sys?.country && <span className="cw-country">, {data.sys.country}</span>}
          </h1>
          <p className="cw-datetime">{formatTime(data.dt, tz, 'daylong')}, {formatTime(data.dt, tz, 'time')}</p>
        </div>
        <div className="cw-icon-wrap">
          <span className="cw-icon">{icon}</span>
        </div>
      </div>

      <div className="cw-main">
        <div className="cw-temp-block">
          <span className="cw-temp">{formatTemp(data.main.temp, units)}</span>
          <div className="cw-temp-range">
            <span className="temp-high">↑ {formatTemp(data.main.temp_max, units)}</span>
            <span className="temp-low">↓ {formatTemp(data.main.temp_min, units)}</span>
          </div>
        </div>
        <div className="cw-desc-block">
          <p className="cw-condition">{description}</p>
          <p className="cw-feels">Feels like <strong>{formatTemp(data.main.feels_like, units)}</strong></p>
        </div>
      </div>

      <div className="cw-quick-stats">
        <div className="qs-item">
          <span className="qs-icon">💧</span>
          <span className="qs-val">{data.main.humidity}%</span>
          <span className="qs-label">Humidity</span>
        </div>
        <div className="qs-divider" />
        <div className="qs-item">
          <span className="qs-icon">💨</span>
          <span className="qs-val">{formatWind(data.wind.speed, units)}</span>
          <span className="qs-label">Wind {getWindDirection(data.wind.deg)}</span>
        </div>
        <div className="qs-divider" />
        <div className="qs-item">
          <span className="qs-icon">🌡️</span>
          <span className="qs-val">{data.main.pressure} hPa</span>
          <span className="qs-label">Pressure</span>
        </div>
        <div className="qs-divider" />
        <div className="qs-item">
          <span className="qs-icon">👁️</span>
          <span className="qs-val">{data.visibility ? `${(data.visibility / 1000).toFixed(0)} km` : 'N/A'}</span>
          <span className="qs-label">Visibility</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
