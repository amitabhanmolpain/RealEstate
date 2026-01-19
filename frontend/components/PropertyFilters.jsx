import React from 'react';
import { cities, propertyTypes } from '../src/data/properties.js';

const PropertyFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handlePriceChange = (type, value) => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value ? parseInt(value) : null
      }
    });
  };

  const handleBedroomsChange = (value) => {
    onFilterChange({
      ...filters,
      bedrooms: value === filters.bedrooms ? null : value
    });
  };

  const handleCityChange = (city) => {
    onFilterChange({
      ...filters,
      city: city === filters.city ? null : city
    });
  };

  const handleTypeChange = (type) => {
    onFilterChange({
      ...filters,
      type: type === filters.type ? null : type
    });
  };

  const hasActiveFilters = () => {
    return filters.priceRange.min || filters.priceRange.max || 
           filters.bedrooms || filters.city || filters.type;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters() && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-400 hover:text-red-500 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="number"
              placeholder="Min (Lakhs)"
              value={filters.priceRange.min ? filters.priceRange.min / 100000 : ''}
              onChange={(e) => handlePriceChange('min', e.target.value ? e.target.value * 100000 : null)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Max (Lakhs)"
              value={filters.priceRange.max ? filters.priceRange.max / 100000 : ''}
              onChange={(e) => handlePriceChange('max', e.target.value ? e.target.value * 100000 : null)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleBedroomsChange(num)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filters.bedrooms === num
                  ? 'bg-red-300 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {num} BHK
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          City
        </label>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filters.city === city
                  ? 'bg-red-300 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Type
        </label>
        <div className="flex flex-wrap gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                filters.type === type
                  ? 'bg-red-300 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
