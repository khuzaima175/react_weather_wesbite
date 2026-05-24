// Weather condition to emoji icon
export const getWeatherIcon = (condition, isNight = false) => {
  const c = condition?.toLowerCase() || '';
  if (c.includes('thunderstorm')) return '⛈️';
  if (c.includes('drizzle')) return '🌦️';
  if (c.includes('rain')) return '🌧️';
  if (c.includes('snow') || c.includes('sleet') || c.includes('blizzard')) return '❄️';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
  if (c.includes('dust') || c.includes('sand') || c.includes('ash')) return '🌪️';
  if (c.includes('squall') || c.includes('tornado')) return '🌪️';
  if (c.includes('clear')) return isNight ? '🌙' : '☀️';
  if (c.includes('few clouds')) return isNight ? '🌛' : '🌤️';
  if (c.includes('scattered')) return '⛅';
  if (c.includes('broken') || c.includes('overcast')) return '☁️';
  if (c.includes('cloud')) return isNight ? '☁️' : '🌥️';
  return isNight ? '🌙' : '⛅';
};

// Background class based on weather condition
export const getBgClass = (condition, isNight) => {
  const c = condition?.toLowerCase() || '';
  if (isNight) return 'bg-night';
  if (c.includes('thunderstorm')) return 'bg-storm';
  if (c.includes('drizzle') || c.includes('rain')) return 'bg-rain';
  if (c.includes('snow')) return 'bg-snow';
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return 'bg-fog';
  if (c.includes('clear')) return 'bg-sunny';
  if (c.includes('cloud')) return 'bg-cloudy';
  return 'bg-default';
};

// Wind direction from degrees
export const getWindDirection = (degrees) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
};

// Format Unix timestamp to local time string
export const formatTime = (unixTs, tzOffset, format = 'time') => {
  const d = new Date((unixTs + tzOffset) * 1000);
  const opts = { timeZone: 'UTC' };
  if (format === 'time') return d.toLocaleTimeString('en-US', { ...opts, hour: 'numeric', minute: '2-digit', hour12: true });
  if (format === 'hour') return d.toLocaleTimeString('en-US', { ...opts, hour: 'numeric', hour12: true });
  if (format === 'day') return d.toLocaleDateString('en-US', { ...opts, weekday: 'short' });
  if (format === 'daylong') return d.toLocaleDateString('en-US', { ...opts, weekday: 'long' });
  if (format === 'date') return d.toLocaleDateString('en-US', { ...opts, month: 'short', day: 'numeric' });
  return d.toLocaleString('en-US', { ...opts });
};

// Format temperature
export const formatTemp = (temp, units) => `${Math.round(temp)}°${units === 'metric' ? 'C' : 'F'}`;

// Format wind speed
export const formatWind = (speed, units) => units === 'metric' ? `${Math.round(speed)} m/s` : `${Math.round(speed)} mph`;

// Visibility in km or miles
export const formatVisibility = (meters, units) => {
  if (units === 'metric') return `${(meters / 1000).toFixed(1)} km`;
  return `${(meters / 1609.34).toFixed(1)} mi`;
};

// AQI label and color
export const getAQIInfo = (aqi) => {
  const levels = [
    { label: 'Good', color: '#22c55e', description: 'Air quality is satisfactory.' },
    { label: 'Fair', color: '#eab308', description: 'Air quality is acceptable.' },
    { label: 'Moderate', color: '#f97316', description: 'Sensitive groups may be affected.' },
    { label: 'Poor', color: '#ef4444', description: 'Health effects for everyone.' },
    { label: 'Very Poor', color: '#a855f7', description: 'Emergency health warning.' },
  ];
  return levels[Math.min((aqi || 1) - 1, 4)];
};

// Check if it's nighttime
export const isNighttime = (dt, sunrise, sunset) => dt < sunrise || dt > sunset;

// Group forecast by day and pick daily min/max
export const getDailyForecasts = (list, timezone) => {
  const days = {};
  list.forEach(item => {
    const d = new Date((item.dt + timezone) * 1000);
    const key = d.toISOString().slice(0, 10);
    if (!days[key]) {
      days[key] = { dt: item.dt, temps: [], icons: [], descriptions: [], pops: [] };
    }
    days[key].temps.push(item.main.temp);
    days[key].icons.push(item.weather[0].icon);
    days[key].descriptions.push(item.weather[0].main);
    days[key].pops.push(item.pop || 0);
  });

  return Object.values(days).slice(0, 5).map(day => ({
    dt: day.dt,
    tempMin: Math.min(...day.temps),
    tempMax: Math.max(...day.temps),
    icon: day.icons[Math.floor(day.icons.length / 2)],
    description: day.descriptions[Math.floor(day.descriptions.length / 2)],
    pop: Math.max(...day.pops), // max precipitation probability for the day
  }));
};
