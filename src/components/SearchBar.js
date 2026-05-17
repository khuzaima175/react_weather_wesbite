import React, { useState, useRef, useEffect } from 'react';

function SearchBar({ value, onChange, onSearch, onGeolocate, searchHistory, isLoading }) {
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { onSearch(); setShowHistory(false); }
    if (e.key === 'Escape') setShowHistory(false);
  };

  const handleHistoryClick = (city) => {
    onChange(city);
    setShowHistory(false);
    setTimeout(() => onSearch(), 0);
  };

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
          placeholder="Search for a city..."
          className="search-input"
          disabled={isLoading}
          aria-label="City search"
          id="city-search-input"
          autoComplete="off"
        />
        {value && (
          <button
            className="search-clear"
            onClick={() => { onChange(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >✕</button>
        )}
        <button
          className="geo-btn"
          onClick={onGeolocate}
          disabled={isLoading}
          aria-label="Use my location"
          title="Use my location"
          id="geo-location-btn"
        >
          📍
        </button>
        <button
          className="search-btn"
          onClick={() => { onSearch(); setShowHistory(false); }}
          disabled={isLoading || !value.trim()}
          id="search-submit-btn"
        >
          {isLoading ? <span className="spin">⟳</span> : 'Search'}
        </button>
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="search-history" role="listbox">
          <div className="history-label">Recent Searches</div>
          {searchHistory.map((city, idx) => (
            <button
              key={idx}
              className="history-item"
              onClick={() => handleHistoryClick(city)}
              role="option"
              aria-selected="false"
            >
              <span className="history-icon">🕐</span>
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
