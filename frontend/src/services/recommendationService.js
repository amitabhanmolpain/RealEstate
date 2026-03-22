/**
 * Recommendations Service
 * Handles API calls for fetching personalized property recommendations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch recommendations for the current user
 * @param {number} page - Page number for pagination (default: 1)
 * @returns {Promise<Object>} - Recommendations data
 */
export const fetchRecommendations = async (page = 1) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations?page=${page}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - Please login again');
      }
      throw new Error(`Failed to fetch recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};

/**
 * Fetch a single recommendation by ID
 * @param {string} recommendationId - ID of the recommendation
 * @returns {Promise<Object>} - Recommendation data
 */
export const fetchRecommendationById = async (recommendationId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/recommendations/${recommendationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendation: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    throw error;
  }
};

export default {
  fetchRecommendations,
  fetchRecommendationById,
};
