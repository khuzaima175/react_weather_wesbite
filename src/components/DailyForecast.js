import React from 'react';
import { getWeatherIcon, formatTemp, formatTime, getDailyForecasts } from '../utils/weatherUtils';

function DailyForecast({ data, units, timezone }) {
  if (!data) return null;
  const days = getDailyForecasts(data, timezone);

  return (
    <div className="glass-card daily-card" id="daily-forecast">
      <div className="card-header">
        <h2 className="card-title">📅 5-Day Forecast</h2>
      </div>
      <div className="daily-list">
        {days.map((day, i) => {
          const icon = getWeatherIcon(day.description, false);
          return (
            <div key={i} className={`daily-row ${i === 0 ? 'daily-today' : ''}`}>
              <span className="daily-day">
                {i === 0 ? 'Today' : formatTime(day.dt, timezone, 'day')}
              </span>
              <span className="daily-icon">{icon}</span>
              <span className="daily-desc">{day.description}</span>
              {day.pop >= 0.05 && (
                <span className="daily-pop">💧{Math.round(day.pop * 100)}%</span>
              )}
              <div className="daily-temps">
                <span className="daily-hi">{formatTemp(day.tempMax, units)}</span>
                <div className="temp-bar-wrap">
                  <div className="temp-bar">
                    <div className="temp-bar-fill" style={{
                      width: `${Math.min(100, ((day.tempMax - day.tempMin) / 20) * 100)}%`
                    }} />
                  </div>
                </div>
                <span className="daily-lo">{formatTemp(day.tempMin, units)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;
