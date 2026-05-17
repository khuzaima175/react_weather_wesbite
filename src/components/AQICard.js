import React from 'react';
import { getAQIInfo } from '../utils/weatherUtils';

function AQICard({ data }) {
  if (!data?.list?.[0]) return null;
  const { aqi } = data.list[0].main;
  const components = data.list[0].components;
  const info = getAQIInfo(aqi);
  const pct = ((aqi - 1) / 4) * 100;

  const pollutants = [
    { label: 'PM2.5', val: components.pm2_5?.toFixed(1), unit: 'μg/m³' },
    { label: 'PM10', val: components.pm10?.toFixed(1), unit: 'μg/m³' },
    { label: 'CO', val: components.co?.toFixed(0), unit: 'μg/m³' },
    { label: 'NO₂', val: components.no2?.toFixed(1), unit: 'μg/m³' },
    { label: 'O₃', val: components.o3?.toFixed(1), unit: 'μg/m³' },
    { label: 'SO₂', val: components.so2?.toFixed(1), unit: 'μg/m³' },
  ];

  return (
    <div className="glass-card aqi-card" id="aqi-card">
      <div className="card-header">
        <h2 className="card-title">🌿 Air Quality</h2>
        <span className="aqi-badge" style={{ background: info.color + '33', color: info.color, border: `1px solid ${info.color}55` }}>
          {info.label}
        </span>
      </div>

      <div className="aqi-main">
        <div className="aqi-score" style={{ color: info.color }}>
          <span className="aqi-number">{aqi}</span>
          <span className="aqi-scale">/ 5</span>
        </div>
        <p className="aqi-desc">{info.description}</p>
      </div>

      <div className="aqi-bar-wrap">
        <div className="aqi-bar">
          <div className="aqi-bar-fill" style={{
            width: `${Math.max(4, pct)}%`,
            background: `linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444, #a855f7)`
          }} />
        </div>
        <div className="aqi-bar-labels">
          {['Good', 'Fair', 'Mod', 'Poor', 'V.Poor'].map(l => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <div className="aqi-pollutants">
        {pollutants.map(p => (
          <div key={p.label} className="aqi-pollutant">
            <span className="poll-label">{p.label}</span>
            <span className="poll-val">{p.val ?? 'N/A'}</span>
            <span className="poll-unit">{p.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AQICard;
