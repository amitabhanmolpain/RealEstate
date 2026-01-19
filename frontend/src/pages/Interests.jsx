import React, { useState, useEffect } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar.jsx';
import PropertyCard from '../../components/PropertyCard.jsx';
import Pagination from '../../components/Pagination.jsx';
import { likeService } from '../services/likeService.js';

const Interests = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchLikedProperties();
  }, [currentPage]);

  const fetchLikedProperties = async () => {
    try {
      setLoading(true);
      const response = await likeService.getLikedProperties(currentPage);
      setProperties(response.properties || []);
      setTotalPages(response.pagination?.total_pages || 0);
    } catch (error) {
      console.error('Error fetching liked properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRemoveFromInterests = async (propertyId) => {
    try {
      await likeService.unlikeProperty(propertyId);
      setProperties(properties.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing from interests:', error);
      alert('Failed to remove from interests');
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="container mx-auto px-6 md:px-20 lg:px-32 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 mb-4 w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 flex-1"></div>
                    <div className="h-4 bg-gray-200 flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Interests</h1>
          <p className="text-gray-600">Properties you've saved</p>
        </div>

        {properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard 
                    property={property}
                    isLiked={true}
                    onLikesChange={fetchLikedProperties}
                  />
                  <button
                    onClick={() => handleRemoveFromInterests(property.id)}
                    className="absolute top-2 right-2 bg-red-400 hover:bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No interests yet</h3>
            <p className="text-gray-600">Start liking properties to save them here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interests;
