import React from 'react';
import { formatWind, formatVisibility, getWindDirection } from '../utils/weatherUtils';

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="stat-card" style={{ '--stat-color': color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  </div>
);

function WeatherStats({ data, units }) {
  if (!data) return null;

  const windDeg = data.wind?.deg ?? 0;
  const windDir = getWindDirection(windDeg);
  const windGust = data.wind?.gust;

  const stats = [
    {
      icon: '💧', label: 'Humidity', color: '#38bdf8',
      value: `${data.main.humidity}%`,
      sub: data.main.humidity > 70 ? 'High' : data.main.humidity < 30 ? 'Low' : 'Comfortable',
    },
    {
      icon: '💨', label: 'Wind Speed', color: '#a3e635',
      value: formatWind(data.wind?.speed || 0, units),
      sub: `${windDir} direction`,
    },
    {
      icon: '🌡️', label: 'Pressure', color: '#fb923c',
      value: `${data.main.pressure} hPa`,
      sub: data.main.pressure > 1013 ? 'High pressure' : 'Low pressure',
    },
    {
      icon: '👁️', label: 'Visibility', color: '#c084fc',
      value: formatVisibility(data.visibility || 0, units),
      sub: data.visibility >= 10000 ? 'Clear' : data.visibility >= 5000 ? 'Good' : 'Limited',
    },
    {
      icon: '🌡️', label: 'Feels Like', color: '#f472b6',
      value: `${Math.round(data.main.feels_like)}°`,
      sub: data.main.feels_like < data.main.temp ? 'Colder than actual' : 'Warmer than actual',
    },
    {
      icon: '🌬️', label: 'Wind Gust', color: '#34d399',
      value: windGust ? formatWind(windGust, units) : 'N/A',
      sub: windGust ? (windGust > 10 ? 'Strong gusts' : 'Light gusts') : 'No gust data',
    },
  ];

  return (
    <div className="glass-card stats-card" id="weather-stats">
      <div className="card-header">
        <h2 className="card-title">📊 Weather Details</h2>
      </div>
      <div className="stats-grid">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
    </div>
  );
}

export default WeatherStats;
