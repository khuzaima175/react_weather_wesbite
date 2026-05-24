import React from 'react';
import { formatTime } from '../utils/weatherUtils';

function SunArc({ sunrise, sunset, current, timezone }) {
  if (!sunrise || !sunset) return null;

  const total = sunset - sunrise;
  const elapsed = Math.max(0, Math.min(current - sunrise, total));
  const progress = total > 0 ? elapsed / total : 0;
  const pct = Math.round(progress * 100);

  // SVG arc path
  const cx = 120, cy = 110, r = 90;
  // progress 0→1 across the semicircle arc
  const sunX = cx + r * Math.cos(Math.PI + progress * Math.PI);
  const sunY = cy + r * Math.sin(Math.PI + progress * Math.PI);

  const arcD = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const progressD = progress > 0
    ? `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${sunX} ${sunY}`
    : '';

  const isDaytime = current >= sunrise && current <= sunset;

  return (
    <div className="glass-card sun-card" id="sun-arc">
      <div className="card-header">
        <h2 className="card-title">🌅 Sun & Moon</h2>
        <span className="sun-status">{isDaytime ? '☀️ Daytime' : '🌙 Nighttime'}</span>
      </div>

      <div className="sun-arc-wrap">
        <svg viewBox="0 0 240 130" className="sun-svg" aria-label="Sun position arc">
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path d={arcD} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" />
          {/* Progress arc */}
          {progressD && (
            <path d={progressD} fill="none" stroke="url(#sunGrad)" strokeWidth="6" strokeLinecap="round" />
          )}
          {/* Horizon line */}
          <line x1={cx - r - 10} y1={cy} x2={cx + r + 10} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Sun dot */}
          {isDaytime && (
            <g>
              <circle cx={sunX} cy={sunY} r="10" fill="rgba(251,191,36,0.25)" />
              <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
            </g>
          )}
          {/* Sunrise label */}
          <text x={cx - r} y={cy + 18} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">Rise</text>
          {/* Sunset label */}
          <text x={cx + r} y={cy + 18} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">Set</text>
        </svg>
      </div>

      <div className="sun-times">
        <div className="sun-times-row">
          <div className="sun-time-item">
            <span className="sun-time-icon">🌅</span>
            <div>
              <span className="sun-time-label">Sunrise</span>
              <span className="sun-time-val">{formatTime(sunrise, timezone, 'time')}</span>
            </div>
          </div>
          <div className="sun-time-item">
            <span className="sun-time-icon">🌇</span>
            <div>
              <span className="sun-time-label">Sunset</span>
              <span className="sun-time-val">{formatTime(sunset, timezone, 'time')}</span>
            </div>
          </div>
        </div>
        <div className="sun-progress-pill">
          <div className="sun-progress-fill" style={{ width: `${pct}%` }} />
          <span className="sun-progress-label">{isDaytime ? `${pct}% of day` : 'After sunset'}</span>
        </div>
      </div>
    </div>
  );
}

export default SunArc;
