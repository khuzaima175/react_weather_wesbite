import React, { useRef } from 'react';
import { getWeatherIcon, formatTemp, formatTime } from '../utils/weatherUtils';

function HourlyForecast({ data, units, timezone }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <div className="hourly-section glass-card" id="hourly-forecast">
      <div className="card-header">
        <h2 className="card-title">⏱ Hourly Forecast</h2>
        <div className="scroll-controls">
          <button className="scroll-btn" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
          <button className="scroll-btn" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
        </div>
      </div>
      <div className="hourly-scroll" ref={scrollRef}>
        {data.map((item, i) => {
          const icon = getWeatherIcon(item.weather?.[0]?.main, false);
          const pop = Math.round((item.pop || 0) * 100);
          return (
            <div key={i} className={`hourly-card ${i === 0 ? 'hourly-now' : ''}`}>
              <span className="h-time">{i === 0 ? 'Now' : formatTime(item.dt, timezone, 'hour')}</span>
              <span className="h-icon">{icon}</span>
              <span className="h-temp">{formatTemp(item.main.temp, units)}</span>
              {pop > 0 && <span className="h-pop">💧 {pop}%</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;
