import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../services/recommendationService';
import PropertyCard from '../../components/PropertyCard';

/**
 * Recommendations Component
 * Displays personalized property recommendations based on user's liked properties
 */
const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadRecommendations(currentPage);
  }, [currentPage]);

  const loadRecommendations = async (page) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecommendations(page);
      
      if (data.recommendations && data.recommendations.length > 0) {
        // Flatten the recommendations to show all recommended properties
        const allRecommendedProperties = [];
        data.recommendations.forEach(rec => {
          if (rec.recommended_properties) {
            allRecommendedProperties.push(...rec.recommended_properties);
          }
        });
        
        setRecommendations(allRecommendedProperties);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
        }
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      if (err.message.includes('Unauthorized')) {
        setError('Please login to view recommendations');
      } else {
        setError('Failed to load recommendations. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            ✨ Recommended for You
          </h1>
          <p className="text-slate-600 text-lg">
            Based on properties you've liked, we found these perfect matches for you.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600">Loading your recommendations...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12a7.5 7.5 0 1015 0m-15 0a7.5 7.5 0 1015 0m-15 0H3m16.5 0H21M12 3v6m0 6v6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start liking properties to get personalized recommendations based on your preferences.
            </p>
          </div>
        )}

        {/* Recommendations Grid */}
        {!loading && !error && recommendations.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recommendations.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
