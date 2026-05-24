import React, { useMemo, useState, useEffect } from 'react';

const rand = (min, max) => Math.random() * (max - min) + min;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const listener = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);
  return isMobile;
}

function RainDrops({ isMobile }) {
  const drops = useMemo(() => Array.from({ length: isMobile ? 20 : 40 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    delay: `${rand(0, 2)}s`,
    duration: `${rand(0.6, 1.2)}s`,
    opacity: rand(0.3, 0.7),
    height: `${rand(10, 22)}px`,
  })), [isMobile]);

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

function SnowFlakes({ isMobile }) {
  const flakes = useMemo(() => Array.from({ length: isMobile ? 15 : 25 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    delay: `${rand(0, 5)}s`,
    duration: `${rand(3, 6)}s`,
    size: `${rand(4, 10)}px`,
    opacity: rand(0.4, 0.9),
  })), [isMobile]);

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

function Stars({ isMobile }) {
  const stars = useMemo(() => Array.from({ length: isMobile ? 25 : 50 }, (_, i) => ({
    id: i,
    left: `${rand(0, 100)}%`,
    top: `${rand(0, 60)}%`,
    delay: `${rand(0, 4)}s`,
    duration: `${rand(2, 5)}s`,
    size: `${rand(1, 3)}px`,
    opacity: rand(0.4, 1),
  })), [isMobile]);

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

function SunRays({ isMobile }) {
  const count = isMobile ? 4 : 8;
  return (
    <div className="particles sun-particles" aria-hidden="true">
      <div className="sun-orb" />
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="sun-ray" style={{ transform: `rotate(${i * (360 / count)}deg)` }} />
      ))}
    </div>
  );
}

function Clouds({ isMobile }) {
  const clouds = useMemo(() => Array.from({ length: isMobile ? 2 : 4 }, (_, i) => ({
    id: i,
    top: `${rand(5, 30)}%`,
    delay: `${rand(0, 10)}s`,
    duration: `${rand(25, 45)}s`,
    scale: rand(0.6, 1.2),
    opacity: rand(0.08, 0.18),
  })), [isMobile]);

  return (
    <div className="particles cloud-particles" aria-hidden="true">
      {clouds.map(c => (
        <div key={c.id} className="cloud-container" style={{
          top: c.top, animationDelay: c.delay,
          animationDuration: c.duration,
        }}>
          <div className="cloud-shape" style={{
            transform: `scale(${c.scale})`,
            opacity: c.opacity,
          }} />
        </div>
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

function WeatherBackground({ condition, isNight, lowPerf }) {
  const isMobile = useIsMobile();
  const c = condition?.toLowerCase() || '';

  if (lowPerf) return null;

  if (isNight) return <Stars isMobile={isMobile} />;
  if (c.includes('thunderstorm')) return <><RainDrops isMobile={isMobile} /><StormFlash /></>;
  if (c.includes('drizzle') || c.includes('rain')) return <RainDrops isMobile={isMobile} />;
  if (c.includes('snow')) return <SnowFlakes isMobile={isMobile} />;
  if (c.includes('clear')) return <SunRays isMobile={isMobile} />;
  if (c.includes('cloud')) return <Clouds isMobile={isMobile} />;
  return <Clouds isMobile={isMobile} />;
}

export default WeatherBackground;
