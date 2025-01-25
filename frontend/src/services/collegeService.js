const API_BASE_URL = 'http://localhost:3000/api';

export const collegeService = {
  async createCollege(collegeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collegeData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create college');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating college:', error);
      throw error;
    }
  },

  async addRating(collegeId, ratingData) {
    try {
      const response = await fetch(`${API_BASE_URL}/colleges/${collegeId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add rating');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }
}; 