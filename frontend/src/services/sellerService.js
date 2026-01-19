const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// ===== SELLER PROPERTY MANAGEMENT =====

export const sellerService = {
  // Get all properties listed by the current seller
  async getMyProperties() {
    try {
      const response = await fetch(`${API_URL}/seller/properties`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch properties');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching seller properties:', error);
      throw error;
    }
  },

  // Create a new property listing
  async createProperty(propertyData) {
    try {
      const response = await fetch(`${API_URL}/seller/properties`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  // Update a property
  async updateProperty(propertyId, propertyData) {
    try {
      const response = await fetch(`${API_URL}/seller/properties/${propertyId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  // Delete a property
  async deleteProperty(propertyId) {
    try {
      const response = await fetch(`${API_URL}/seller/properties/${propertyId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete property');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  // ===== DASHBOARD & INSIGHTS =====

  // Get seller dashboard statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_URL}/seller/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch dashboard stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activity
  async getRecentActivity(limit = 10) {
    try {
      const response = await fetch(`${API_URL}/seller/activity?limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch activity');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw error;
    }
  },

  // ===== SCHEDULED VISITS =====

  // Get all visits for seller's properties
  async getVisits(status = null) {
    try {
      const url = status 
        ? `${API_URL}/seller/visits?status=${status}`
        : `${API_URL}/seller/visits`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch visits');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  },

  // Update visit status
  async updateVisitStatus(visitId, status) {
    try {
      const response = await fetch(`${API_URL}/seller/visits/${visitId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update visit');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating visit:', error);
      throw error;
    }
  },

  // ===== INTERESTS =====

  // Get all interests for seller's properties
  async getInterests(status = null) {
    try {
      const url = status 
        ? `${API_URL}/seller/interests?status=${status}`
        : `${API_URL}/seller/interests`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch interests');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching interests:', error);
      throw error;
    }
  },

  // Update interest status
  async updateInterestStatus(interestId, status) {
    try {
      const response = await fetch(`${API_URL}/seller/interests/${interestId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update interest');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating interest:', error);
      throw error;
    }
  },
};

// ===== USER ACTIONS (for buyers) =====

export const userPropertyService = {
  // Schedule a visit for a property
  async scheduleVisit(propertyId, visitData) {
    try {
      const response = await fetch(`${API_URL}/properties/${propertyId}/schedule-visit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(visitData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to schedule visit');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error scheduling visit:', error);
      throw error;
    }
  },

  // Get user's scheduled visits
  async getMyVisits() {
    try {
      const response = await fetch(`${API_URL}/user/visits`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch visits');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
  },

  // Express interest in a property
  async expressInterest(propertyId, data = {}) {
    try {
      const response = await fetch(`${API_URL}/properties/${propertyId}/interest`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to express interest');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error expressing interest:', error);
      throw error;
    }
  },

  // Track property view
  async trackView(propertyId) {
    try {
      await fetch(`${API_URL}/properties/${propertyId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // Silently fail - view tracking shouldn't break the UI
      console.error('Error tracking view:', error);
    }
  },
};

export default sellerService;
