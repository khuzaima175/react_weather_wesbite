import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';

function SearchBar({ value, onChange, onSearch, onGeolocate, searchHistory, isLoading }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);

  const inputRef   = useRef(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync internal input value when the value prop changes from parent
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch city suggestions from autocomplete API (debounced 300ms)
  const fetchSuggestions = useCallback((query) => {
    clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(searchHistory.length > 0);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsFetchingSuggestions(true);
      try {
        const { data } = await axios.get('/api/autocomplete', { params: { q: query }, timeout: 6000 });
        setSuggestions(data || []);
        setShowDropdown(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetchingSuggestions(false);
      }
    }, 300);
  }, [searchHistory.length]);

  const handleInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    fetchSuggestions(v);
  };

  const handleFocus = () => {
    if (!inputValue || inputValue.trim().length < 2) {
      if (searchHistory.length > 0) setShowDropdown(true);
    } else {
      fetchSuggestions(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    const items = suggestions.length > 0 ? suggestions : searchHistory.map(h => ({ display: h, name: h }));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && items[activeIndex]) {
        selectItem(items[activeIndex].display || items[activeIndex].name || items[activeIndex]);
      } else {
        onChange(inputValue);
        onSearch(inputValue);
        setShowDropdown(false);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  const selectItem = (cityName) => {
    setInputValue(cityName);
    onChange(cityName);
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    onSearch(cityName);
  };

  // Decide what to show in the dropdown
  const showSuggestions  = suggestions.length > 0;
  const showHistory      = !showSuggestions && searchHistory.length > 0 && (!inputValue || inputValue.trim().length < 2);
  const dropdownVisible  = showDropdown && (showSuggestions || showHistory);

  return (
    <div className="search-container" ref={wrapperRef}>
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder="Search for a city..."
          className="search-input"
          disabled={isLoading}
          aria-label="City search"
          id="city-search-input"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
          aria-expanded={dropdownVisible}
        />
        {isFetchingSuggestions && (
          <span className="search-loading-dot" title="Fetching suggestions…" />
        )}
        {inputValue && (
          <button
            className="search-clear"
            onClick={() => {
              setInputValue('');
              onChange('');
              setSuggestions([]);
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
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
          onClick={() => {
            onChange(inputValue);
            onSearch(inputValue);
            setShowDropdown(false);
          }}
          disabled={isLoading || !inputValue.trim()}
          id="search-submit-btn"
        >
          {isLoading ? <span className="spin">⟳</span> : 'Search'}
        </button>
      </div>

      {dropdownVisible && (
        <div className="search-history" role="listbox" aria-label="Search suggestions" id="search-suggestions-list">
          {showSuggestions ? (
            <>
              <div className="history-label">🌍 City suggestions</div>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  className={`history-item${activeIndex === idx ? ' history-item--active' : ''}`}
                  onClick={() => selectItem(s.display || s.name)}
                  role="option"
                  aria-selected={activeIndex === idx}
                >
                  <span className="history-icon">📍</span>
                  <span className="suggestion-name">{s.name}</span>
                  {(s.state || s.country) && (
                    <span className="suggestion-meta">
                      {[s.state, s.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="history-label">Recent Searches</div>
              {searchHistory.map((city, idx) => (
                <button
                  key={idx}
                  className={`history-item${activeIndex === idx ? ' history-item--active' : ''}`}
                  onClick={() => selectItem(city)}
                  role="option"
                  aria-selected={activeIndex === idx}
                >
                  <span className="history-icon">🕐</span>
                  {city}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
