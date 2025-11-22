// Search and filter utility functions

export const searchProperties = (properties, query) => {
  if (!query || query.trim() === '') {
    return properties;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return properties.filter(property => {
    return (
      property.title.toLowerCase().includes(lowerQuery) ||
      property.location.toLowerCase().includes(lowerQuery) ||
      property.city.toLowerCase().includes(lowerQuery) ||
      property.type.toLowerCase().includes(lowerQuery) ||
      property.description.toLowerCase().includes(lowerQuery)
    );
  });
};

export const filterProperties = (properties, filters) => {
  return properties.filter(property => {
    // Price range filter
    if (filters.priceRange.min && property.price < filters.priceRange.min) {
      return false;
    }
    if (filters.priceRange.max && property.price > filters.priceRange.max) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
      return false;
    }

    // City filter
    if (filters.city && property.city !== filters.city) {
      return false;
    }

    // Property type filter
    if (filters.type && property.type !== filters.type) {
      return false;
    }

    return true;
  });
};

export const applySearchAndFilters = (properties, query, filters) => {
  let results = searchProperties(properties, query);
  results = filterProperties(results, filters);
  return results;
};
