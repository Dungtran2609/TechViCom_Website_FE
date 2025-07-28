import apiClient from '../client.js';

// News Service
export const newsService = {
  // Lấy danh sách tất cả news
  getAll: async (params = {}) => {
    return apiClient.get('/news', params);
  },

  // Lấy news theo ID
  getById: async (id) => {
    return apiClient.get(`/news/${id}`);
  },

  // Tạo news mới
  create: async (newsData) => {
    return apiClient.post('/news', newsData);
  },

  // Cập nhật news
  update: async (id, newsData) => {
    return apiClient.patch(`/news/${id}`, newsData);
  },

  // Xóa news
  delete: async (id) => {
    return apiClient.delete(`/news/${id}`);
  },

  // Lấy news nổi bật
  getFeatured: async (limit = 3) => {
    return apiClient.get('/news', { 
      featured: true,
      _limit: limit 
    });
  },

  // Tìm kiếm news
  search: async (query, params = {}) => {
    return apiClient.get('/news', { 
      q: query,
      ...params 
    });
  },

  // Thêm comment vào news
  addComment: async (newsId, commentData) => {
    return apiClient.post(`/news/${newsId}/comments`, commentData);
  },

  // Lấy comments của news
  getComments: async (newsId) => {
    return apiClient.get(`/news/${newsId}/comments`);
  }
}; 