import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, properties }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      // Generate suggestions based on query
      const lowerQuery = query.toLowerCase();
      const matches = [];

      properties.forEach(property => {
        if (
          property.title.toLowerCase().includes(lowerQuery) ||
          property.location.toLowerCase().includes(lowerQuery) ||
          property.city.toLowerCase().includes(lowerQuery) ||
          property.type.toLowerCase().includes(lowerQuery)
        ) {
          matches.push({
            text: property.title,
            subtext: property.location,
            type: 'property'
          });
        }
      });

      // Add unique city suggestions
      const cities = [...new Set(properties.map(p => p.city))];
      cities.forEach(city => {
        if (city.toLowerCase().includes(lowerQuery)) {
          matches.push({
            text: city,
            subtext: 'City',
            type: 'city'
          });
        }
      });

      // Remove duplicates and limit
      const uniqueMatches = Array.from(
        new Map(matches.map(m => [m.text, m])).values()
      ).slice(0, 6);

      setSuggestions(uniqueMatches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, properties]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    onSearch(suggestion.text);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by location, city, or property type..."
            className="w-full px-5 py-3 pl-12 pr-24 rounded-lg border-2 border-gray-200 focus:border-red-300 focus:outline-none transition"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-300 hover:bg-red-400 text-black font-medium px-4 py-2 rounded-lg transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSuggestions(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border z-20 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{suggestion.text}</p>
                    <p className="text-xs text-gray-500">{suggestion.subtext}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;
