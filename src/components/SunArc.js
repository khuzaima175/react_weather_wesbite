import React from 'react';
import { formatTime } from '../utils/weatherUtils';

function SunArc({ sunrise, sunset, current, timezone }) {
  if (!sunrise || !sunset) return null;

  const isDaytime = current >= sunrise && current <= sunset;

  let progress = 0;
  let countdownText = '';

  if (isDaytime) {
    const totalDay = sunset - sunrise;
    progress = totalDay > 0 ? Math.max(0, Math.min((current - sunrise) / totalDay, 1)) : 0;
    const secsLeft = sunset - current;
    const hrs = Math.floor(secsLeft / 3600);
    const mins = Math.floor((secsLeft % 3600) / 60);
    countdownText = hrs > 0 ? `Sunset in ${hrs}h ${mins}m` : `Sunset in ${mins}m`;
  } else {
    let lastSunset = sunset;
    let nextSunrise = sunrise;
    if (current > sunset) {
      nextSunrise = sunrise + 86400;
    } else {
      lastSunset = sunset - 86400;
    }
    const totalNight = nextSunrise - lastSunset;
    progress = totalNight > 0 ? Math.max(0, Math.min((current - lastSunset) / totalNight, 1)) : 0;

    const secsLeft = Math.max(0, nextSunrise - current);
    const hrs = Math.floor(secsLeft / 3600);
    const mins = Math.floor((secsLeft % 3600) / 60);
    countdownText = hrs > 0 ? `Sunrise in ${hrs}h ${mins}m` : `Sunrise in ${mins}m`;
  }

  const pct = Math.round(progress * 100);

  // SVG arc positioning
  const cx = 120, cy = 105, r = 85;
  const orbX = cx + r * Math.cos(Math.PI + progress * Math.PI);
  const orbY = cy + r * Math.sin(Math.PI + progress * Math.PI);

  const arcD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const progressD = progress > 0
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${orbX} ${orbY}`
    : '';

  return (
    <div className="glass-card sun-card" id="sun-arc">
      <div className="card-header">
        <h2 className="card-title">🌅 Sun & Moon</h2>
        <span className={`sun-status-badge ${isDaytime ? 'day' : 'night'}`}>
          {isDaytime ? '☀️ Daytime' : '🌙 Nighttime'}
        </span>
      </div>

      <div className="sun-arc-wrap">
        <svg viewBox="0 0 240 125" className="sun-svg" aria-label="Sun and Moon arc">
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="moonGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="orbGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Background arc */}
          <path d={arcD} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" strokeDasharray="5 4" />
          
          {/* Progress arc */}
          {progressD && (
            <path
              d={progressD}
              fill="none"
              stroke={isDaytime ? "url(#sunGrad)" : "url(#moonGrad)"}
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}

          {/* Horizon line */}
          <line x1={cx - r - 12} y1={cy} x2={cx + r + 12} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

          {/* Sun / Moon Orb */}
          <g filter="url(#orbGlow)">
            <circle
              cx={orbX}
              cy={orbY}
              r="10"
              fill={isDaytime ? "rgba(251,191,36,0.3)" : "rgba(168,85,247,0.3)"}
            />
            <circle
              cx={orbX}
              cy={orbY}
              r="5"
              fill={isDaytime ? "#fbbf24" : "#e2e8f0"}
            />
          </g>

          {/* Sunrise & Sunset labels */}
          <text x={cx - r} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.45)">Rise</text>
          <text x={cx + r} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="600" fill="rgba(255,255,255,0.45)">Set</text>
        </svg>
      </div>

      <div className="sun-details-grid">
        <div className="sun-detail-card">
          <span className="sun-detail-icon">🌅</span>
          <div className="sun-detail-info">
            <span className="sun-detail-label">Sunrise</span>
            <span className="sun-detail-val">{formatTime(sunrise, timezone, 'time')}</span>
          </div>
        </div>

        <div className="sun-detail-card">
          <span className="sun-detail-icon">🌇</span>
          <div className="sun-detail-info">
            <span className="sun-detail-label">Sunset</span>
            <span className="sun-detail-val">{formatTime(sunset, timezone, 'time')}</span>
          </div>
        </div>
      </div>

      <div className="sun-footer-info">
        <span className="sun-footer-text">{countdownText} • {pct}%</span>
      </div>
    </div>
  );
}

export default SunArc;
