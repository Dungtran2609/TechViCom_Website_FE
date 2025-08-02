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

  // Lấy news nổi bật
  getFeatured: async () => {
    return apiClient.get('/news/featured');
  },

  // Tạo news mới (cần auth)
  create: async (newsData) => {
    return apiClient.post('/news', newsData);
  },

  // Cập nhật news (cần auth)
  update: async (id, newsData) => {
    return apiClient.put(`/news/${id}`, newsData);
  },

  // Xóa news (cần auth)
  delete: async (id) => {
    return apiClient.delete(`/news/${id}`);
  },

  // Tìm kiếm news
  search: async (query, params = {}) => {
    return apiClient.get('/news', { 
      q: query,
      ...params 
    });
  },

  // Lấy comments của news
  getComments: async (newsId) => {
    return apiClient.get(`/news/${newsId}/comments`);
  },

  // Thêm comment vào news (cần auth)
  addComment: async (newsId, commentData) => {
    return apiClient.post(`/news/${newsId}/comments`, commentData);
  }
}; 