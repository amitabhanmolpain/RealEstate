const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const propertyService = {
  /**
   * Get all properties with pagination and filters
   * @param {number} page - Page number (1-indexed)
   * @param {Object} filters - Filter options
   * @param {string} filters.city - Filter by city
   * @param {string} filters.type - Filter by property type
   * @param {number} filters.minPrice - Minimum price filter
   * @param {number} filters.maxPrice - Maximum price filter
   */
  async getProperties(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({ page });
      
      if (filters.city) params.append('city', filters.city);
      if (filters.type) params.append('type', filters.type);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      const response = await fetch(`${API_BASE_URL}/properties?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  /**
   * Get featured properties
   * @param {number} limit - Number of properties to return
   */
  async getFeaturedProperties(limit = 6) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/properties/featured?limit=${limit}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured properties');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      throw error;
    }
  },

  /**
   * Get a single property by ID
   */
  async getPropertyById(propertyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  /**
   * Create a new property (Admin only)
   */
  async createProperty(data) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  /**
   * Update a property (Admin only)
   */
  async updateProperty(propertyId, data) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  /**
   * Delete a property (Admin only)
   */
  async deleteProperty(propertyId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },
};
