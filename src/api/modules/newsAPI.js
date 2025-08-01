import apiClient from '../client.js';

// ===== NEWS API =====
export const newsAPI = {
  // Lấy tất cả tin tức
  getNews: async (params = {}) => {
    try {
      const response = await apiClient.get('/news', params);
      return response.data;
    } catch (error) {
      console.error('Get news error:', error);
      throw error;
    }
  },

  // Lấy tin tức theo ID
  getNewsById: async (id) => {
    try {
      const response = await apiClient.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get news by ID error:', error);
      throw error;
    }
  },

  // Lấy tin tức nổi bật
  getFeaturedNews: async (limit = 3) => {
    try {
      const response = await apiClient.get('/news', { 
        featured: true,
        _limit: limit 
      });
      return response.data;
    } catch (error) {
      console.error('Get featured news error:', error);
      throw error;
    }
  },

  // Tạo tin tức mới
  createNews: async (newsData) => {
    try {
      const response = await apiClient.post('/news', newsData);
      return response.data;
    } catch (error) {
      console.error('Create news error:', error);
      throw error;
    }
  },

  // Cập nhật tin tức
  updateNews: async (id, newsData) => {
    try {
      const response = await apiClient.patch(`/news/${id}`, newsData);
      return response.data;
    } catch (error) {
      console.error('Update news error:', error);
      throw error;
    }
  },

  // Xóa tin tức
  deleteNews: async (id) => {
    try {
      const response = await apiClient.delete(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete news error:', error);
      throw error;
    }
  }
}; 