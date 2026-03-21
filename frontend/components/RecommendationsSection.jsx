import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecommendations } from '../src/services/recommendationService';
import PropertyCard from './PropertyCard';

/**
 * Recommendations Section Component
 * Small preview of recommendations for the dashboard
 */
const RecommendationsSection = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecommendations(1);
      
      if (data.recommendations && data.recommendations.length > 0) {
        // Get first 4 recommended properties across all recommendations
        const allRecommendedProperties = [];
        data.recommendations.forEach(rec => {
          if (rec.recommended_properties) {
            allRecommendedProperties.push(...rec.recommended_properties);
          }
        });
        
        // Show only first 4
        setRecommendations(allRecommendedProperties.slice(0, 4));
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      // Silently fail on dashboard, recommendations are optional
    } finally {
      setLoading(false);
    }
  };

  // Don't show section if loading or no recommendations
  if (loading || error || recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl my-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <span>✨</span>
              <span>Recommended for You</span>
            </h2>
            <p className="text-slate-600 mt-2">
              Based on properties you've liked, here are some perfect matches
            </p>
          </div>
          <Link
            to="/recommendations"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
