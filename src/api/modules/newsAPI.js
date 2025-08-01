import apiClient from '../client.js';

// ===== NEWS API =====
export const newsAPI = {
  // Lấy tất cả tin tức
  getNews: async (params = {}) => {
    try {
      const response = await apiClient.get('/news', params);
      return response;
    } catch (error) {
      console.error('Get news error:', error);
      throw error;
    }
  },

  // Lấy tin tức theo ID
  getNewsById: async (id) => {
    try {
      const response = await apiClient.get(`/news/${id}`);
      return response;
    } catch (error) {
      console.error('Get news by ID error:', error);
      throw error;
    }
  },

  // Lấy tin tức nổi bật
  getFeaturedNews: async (limit = 3) => {
    try {
      const response = await apiClient.get('/news/featured');
      return response;
    } catch (error) {
      console.error('Get featured news error:', error);
      throw error;
    }
  },

  // Lấy comments của bài viết
  getNewsComments: async (newsId) => {
    try {
      const response = await apiClient.get(`/news/${newsId}/comments`);
      return response;
    } catch (error) {
      console.error('Get news comments error:', error);
      throw error;
    }
  },

  // Thêm comment vào bài viết
  addNewsComment: async (newsId, commentData) => {
    try {
      const response = await apiClient.post(`/news/${newsId}/comments`, commentData);
      return response;
    } catch (error) {
      console.error('Add news comment error:', error);
      throw error;
    }
  },

  // Tạo tin tức mới
  createNews: async (newsData) => {
    try {
      const response = await apiClient.post('/news', newsData);
      return response;
    } catch (error) {
      console.error('Create news error:', error);
      throw error;
    }
  },

  // Cập nhật tin tức
  updateNews: async (id, newsData) => {
    try {
      const response = await apiClient.put(`/news/${id}`, newsData);
      return response;
    } catch (error) {
      console.error('Update news error:', error);
      throw error;
    }
  },

  // Xóa tin tức
  deleteNews: async (id) => {
    try {
      return apiClient.delete(`/news/${id}`);
    } catch (error) {
      console.error('Delete news error:', error);
      throw error;
    }
  },

  // Lấy danh mục tin tức
  getCategories: async () => {
    try {
      const response = await apiClient.get('/news-categories');
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Lấy tin tức theo danh mục
  getNewsByCategory: async (categoryId) => {
    try {
      const response = await apiClient.get(`/news-categories/${categoryId}/news`);
      return response;
    } catch (error) {
      console.error('Get news by category error:', error);
      throw error;
    }
  }
}; 