import React, { useState, useEffect, useRef } from 'react';

export default function AutocompleteInput({ placeholder, onSelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }
    // fetch suggestions from Nominatim API
    fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json&addressdetails=1&limit=5`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data);
        setActiveIndex(-1);
      });
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const loc = suggestions[activeIndex];
        onSelect({
          name: loc.display_name,
          lat: parseFloat(loc.lat),
          lng: parseFloat(loc.lon),
        });
        setInput('');
        setSuggestions([]);
      }
    }
  };

  const handleSelect = (loc) => {
    onSelect({
      name: loc.display_name,
      lat: parseFloat(loc.lat),
      lng: parseFloat(loc.lon),
    });
    setInput('');
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            zIndex: 1000,
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: 200,
            overflowY: 'auto',
            background: 'white',
            border: '1px solid #ccc',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {suggestions.map((loc, i) => (
            <li
              key={loc.place_id}
              onClick={() => handleSelect(loc)}
              onMouseEnter={() => setActiveIndex(i)}
              style={{
                padding: '8px',
                backgroundColor: i === activeIndex ? '#bde4ff' : 'white',
                cursor: 'pointer',
              }}
            >
              {loc.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
