import React from 'react';

function WeatherSkeleton() {
  return (
    <div className="weather-skeleton">
      {/* Current Weather Card Skeleton */}
      <div className="current-weather-card skeleton-card">
        <div className="cw-top">
          <div className="skeleton-info">
            <div className="skeleton-line skeleton-title" style={{ width: '180px', height: '28px', marginBottom: '8px' }} />
            <div className="skeleton-line skeleton-subtitle" style={{ width: '120px', height: '16px' }} />
          </div>
          <div className="skeleton-circle skeleton-icon" style={{ width: '80px', height: '80px' }} />
        </div>
        <div className="cw-main">
          <div className="cw-temp-block">
            <div className="skeleton-line skeleton-temp" style={{ width: '140px', height: '80px' }} />
          </div>
          <div className="cw-desc-block">
            <div className="skeleton-line skeleton-desc" style={{ width: '100px', height: '24px', marginBottom: '6px' }} />
            <div className="skeleton-line skeleton-feels" style={{ width: '130px', height: '16px' }} />
          </div>
        </div>
        <div className="cw-quick-stats">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="qs-item">
              <div className="skeleton-circle" style={{ width: '24px', height: '24px', marginBottom: '8px' }} />
              <div className="skeleton-line" style={{ width: '45px', height: '16px', marginBottom: '4px' }} />
              <div className="skeleton-line" style={{ width: '55px', height: '12px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="glass-card hourly-section skeleton-card">
        <div className="card-header">
          <div className="skeleton-line" style={{ width: '150px', height: '16px' }} />
        </div>
        <div className="hourly-scroll">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="hourly-card skeleton-item" style={{ minWidth: '80px' }}>
              <div className="skeleton-line" style={{ width: '40px', height: '12px', marginBottom: '8px' }} />
              <div className="skeleton-circle" style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
              <div className="skeleton-line" style={{ width: '30px', height: '16px' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="bottom-grid">
        {/* Daily Forecast Skeleton */}
        <div className="glass-card daily-card skeleton-card">
          <div className="card-header">
            <div className="skeleton-line" style={{ width: '130px', height: '16px' }} />
          </div>
          <div className="daily-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="daily-row skeleton-row" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 8px' }}>
                <div className="skeleton-line" style={{ width: '50px', height: '16px' }} />
                <div className="skeleton-circle" style={{ width: '24px', height: '24px' }} />
                <div className="skeleton-line" style={{ flex: 1, height: '16px' }} />
                <div className="skeleton-line" style={{ width: '60px', height: '16px' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="glass-card stats-card skeleton-card">
          <div className="card-header">
            <div className="skeleton-line" style={{ width: '140px', height: '16px' }} />
          </div>
          <div className="stats-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stat-card skeleton-item">
                <div className="skeleton-circle" style={{ width: '24px', height: '24px', marginRight: '12px' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-line" style={{ width: '50px', height: '12px', marginBottom: '6px' }} />
                  <div className="skeleton-line" style={{ width: '70px', height: '18px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sun Arc Skeleton */}
        <div className="glass-card sun-card skeleton-card">
          <div className="card-header">
            <div className="skeleton-line" style={{ width: '100px', height: '16px' }} />
          </div>
          <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="skeleton-circle" style={{ width: '100px', height: '100px' }} />
          </div>
          <div className="sun-times" style={{ marginTop: '12px' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '16px' }} />
            <div className="skeleton-line" style={{ width: '60px', height: '16px' }} />
          </div>
        </div>

        {/* AQI Card Skeleton */}
        <div className="glass-card aqi-card skeleton-card">
          <div className="card-header">
            <div className="skeleton-line" style={{ width: '90px', height: '16px' }} />
          </div>
          <div className="aqi-main" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="skeleton-line" style={{ width: '60px', height: '48px' }} />
            <div className="skeleton-line" style={{ flex: 1, height: '20px' }} />
          </div>
          <div className="skeleton-line" style={{ width: '100%', height: '8px', borderRadius: '4px', marginBottom: '12px' }} />
          <div className="aqi-pollutants">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aqi-pollutant skeleton-item" style={{ height: '50px' }}>
                <div className="skeleton-line" style={{ width: '30px', height: '10px', marginBottom: '6px' }} />
                <div className="skeleton-line" style={{ width: '45px', height: '16px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherSkeleton;
