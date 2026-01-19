const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const likeService = {
  /**
   * Like a property
   */
  async likeProperty(propertyId) {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/likes/properties/${propertyId}`, {
      method: 'POST',
      headers,
    });

    if (response.status === 401) {
      // Token expired or invalid - clear session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to like property');
    }

    return await response.json();
  },

  /**
   * Unlike a property
   */
  async unlikeProperty(propertyId) {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/likes/properties/${propertyId}`, {
      method: 'DELETE',
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to unlike property');
    }

    return await response.json();
  },

  /**
   * Get all liked properties
   */
  async getLikedProperties(page = 1) {
    const headers = getAuthHeaders();
    if (!headers) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/likes/properties?page=${page}`, {
      method: 'GET',
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Failed to fetch liked properties');
    }

    return await response.json();
  },

  /**
   * Check which properties are liked
   */
  async checkLikedProperties() {
    const token = localStorage.getItem('token');
    if (!token) {
      // Not logged in - return empty result silently
      return { liked_properties: [], count: 0 };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/likes/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token invalid/expired - return empty result
        return { liked_properties: [], count: 0 };
      }

      if (!response.ok) {
        return { liked_properties: [], count: 0 };
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking liked properties:', error);
      return { liked_properties: [], count: 0 };
    }
  },
};
