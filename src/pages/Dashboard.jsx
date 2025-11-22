import React, { useState, useMemo } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar.jsx';
import SearchBar from '../../components/SearchBar.jsx';
import PropertyFilters from '../../components/PropertyFilters.jsx';
import PropertyCard from '../../components/PropertyCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import { properties } from '../data/properties.js';
import { applySearchAndFilters } from '../utils/searchHelpers.js';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: { min: null, max: null },
    bedrooms: null,
    city: null,
    type: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [sortBy, setSortBy] = useState('newest');

  // Apply search and filters
  const filteredProperties = useMemo(() => {
    let results = applySearchAndFilters(properties, searchQuery, filters);
    
    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results = [...results].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'featured':
        results = [...results].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }
    
    return results;
  }, [searchQuery, filters, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const handleClearFilters = () => {
    setFilters({
      priceRange: { min: null, max: null },
      bedrooms: null,
      city: null,
      type: null
    });
    setSearchQuery('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Dream Property</h1>
          <p className="text-gray-600">Explore {properties.length} premium properties across India</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} properties={properties} />
        </div>

        {/* Toggle Filters Button (Mobile) */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border-2 border-gray-200 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="sticky top-24">
              <PropertyFilters
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-gray-600">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
              </p>
              
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={handleClearFilters}
                  className="bg-red-300 hover:bg-red-400 text-black font-medium px-6 py-2 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
