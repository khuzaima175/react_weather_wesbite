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
        <span className="sun-status-badge">{isDaytime ? '☀️ Daytime' : '🌙 Nighttime'}</span>
      </div>

      <div className="sun-arc-wrap">
        <svg viewBox="0 0 240 125" className="sun-svg" aria-label="Sun position arc">
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {/* Background dashed arc */}
          <path d={arcD} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" strokeDasharray="6 4" />
          {/* Progress arc */}
          {progressD && (
            <path d={progressD} fill="none" stroke="url(#sunGrad)" strokeWidth="5" strokeLinecap="round" />
          )}
          {/* Horizon line */}
          <line x1={cx - r - 12} y1={cy} x2={cx + r + 12} y2={cy} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          {/* Sun dot */}
          {isDaytime && (
            <g filter="url(#sunGlow)">
              <circle cx={sunX} cy={sunY} r="9" fill="rgba(251,191,36,0.3)" />
              <circle cx={sunX} cy={sunY} r="5" fill="#fbbf24" />
            </g>
          )}
          {/* Moon position if night */}
          {!isDaytime && (
            <g filter="url(#sunGlow)">
              <circle cx={cx} cy={cy - r + 15} r="7" fill="#cbd5e1" />
            </g>
          )}
          {/* Sunrise label */}
          <text x={cx - r} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.5)">Rise</text>
          {/* Sunset label */}
          <text x={cx + r} y={cy + 16} textAnchor="middle" fontSize="9" fontWeight="500" fill="rgba(255,255,255,0.5)">Set</text>
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
        <span className="sun-footer-text">
          {isDaytime ? `Day Progress: ${pct}%` : 'Sun is currently below horizon'}
        </span>
      </div>
    </div>
  );
}

export default SunArc;
