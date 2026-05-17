import React, { useMemo } from 'react';

const rand = (min, max) => Math.random() * (max - min) + min;

function RainDrops() {
  const drops = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    delay: `${rand(0, 2)}s`,
    duration: `${rand(0.6, 1.2)}s`,
    opacity: rand(0.3, 0.7),
    height: `${rand(10, 22)}px`,
  })), []);

  return (
    <div className="particles rain-particles" aria-hidden="true">
      {drops.map(d => (
        <div key={d.id} className="rain-drop" style={{
          left: d.left, animationDelay: d.delay,
          animationDuration: d.duration, opacity: d.opacity, height: d.height,
        }} />
      ))}
    </div>
  );
}

function SnowFlakes() {
  const flakes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    delay: `${rand(0, 5)}s`,
    duration: `${rand(3, 6)}s`,
    size: `${rand(4, 10)}px`,
    opacity: rand(0.4, 0.9),
  })), []);

  return (
    <div className="particles snow-particles" aria-hidden="true">
      {flakes.map(f => (
        <div key={f.id} className="snow-flake" style={{
          left: f.left, animationDelay: f.delay,
          animationDuration: f.duration,
          width: f.size, height: f.size, opacity: f.opacity,
        }} />
      ))}
    </div>
  );
}

function Stars() {
  const stars = useMemo(() => Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    top: `${rand(0, 60)}%`,
    delay: `${rand(0, 4)}s`,
    duration: `${rand(2, 5)}s`,
    size: `${rand(1, 3)}px`,
    opacity: rand(0.4, 1),
  })), []);

  return (
    <div className="particles star-particles" aria-hidden="true">
      {stars.map(s => (
        <div key={s.id} className="star" style={{
          left: s.left, top: s.top,
          animationDelay: s.delay, animationDuration: s.duration,
          width: s.size, height: s.size, opacity: s.opacity,
        }} />
      ))}
    </div>
  );
}

function SunRays() {
  return (
    <div className="particles sun-particles" aria-hidden="true">
      <div className="sun-orb" />
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="sun-ray" style={{ transform: `rotate(${i * 45}deg)` }} />
      ))}
    </div>
  );
}

function Clouds() {
  const clouds = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i,
    top: `${rand(5, 30)}%`,
    delay: `${rand(0, 10)}s`,
    duration: `${rand(25, 45)}s`,
    scale: rand(0.6, 1.2),
    opacity: rand(0.08, 0.18),
  })), []);

  return (
    <div className="particles cloud-particles" aria-hidden="true">
      {clouds.map(c => (
        <div key={c.id} className="cloud-shape" style={{
          top: c.top, animationDelay: c.delay,
          animationDuration: c.duration,
          transform: `scale(${c.scale})`,
          opacity: c.opacity,
        }} />
      ))}
    </div>
  );
}

function StormFlash() {
  return (
    <div className="particles storm-particles" aria-hidden="true">
      <div className="lightning" />
    </div>
  );
}

function WeatherBackground({ condition, isNight }) {
  const c = condition?.toLowerCase() || '';

  if (isNight) return <Stars />;
  if (c.includes('thunderstorm')) return <><RainDrops /><StormFlash /></>;
  if (c.includes('drizzle') || c.includes('rain')) return <RainDrops />;
  if (c.includes('snow')) return <SnowFlakes />;
  if (c.includes('clear')) return <SunRays />;
  if (c.includes('cloud')) return <Clouds />;
  return <Clouds />;
}

export default WeatherBackground;
