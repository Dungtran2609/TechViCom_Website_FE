// File: src/api/modules/newsAPI.js (Bản tối ưu cho Phương án B)

import apiClient from '../client.js';

export const newsAPI = {
  // Lấy tất cả tin tức
  getNews: (params = {}) => {
    return apiClient.get('/api/v1/news', params);
  },

  // Lấy tin tức theo ID
  getNewsById: (id) => {
    return apiClient.get(`/api/v1/news/${id}`);
  },

  // Lấy tin tức nổi bật
  getFeaturedNews: (limit = 3) => {
    return apiClient.get('/api/v1/news', { 
      featured: true,
      _limit: limit 
    });
  },

  // Tạo tin tức mới
  createNews: (newsData) => {
    return apiClient.post('/api/v1/news', newsData);
  },

  // Cập nhật tin tức
  updateNews: (id, newsData) => {
    return apiClient.patch(`/api/v1/news/${id}`, newsData);
  },

  // Xóa tin tức
  deleteNews: (id) => {
    return apiClient.delete(`/api/v1/news/${id}`);
  }
};