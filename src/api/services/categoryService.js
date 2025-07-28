import apiClient from '../client.js';

// Category Service
export const categoryService = {
  // Lấy danh sách tất cả categories
  getAll: async (params = {}) => {
    return apiClient.get('/categories', params);
  },

  // Lấy category theo ID
  getById: async (id) => {
    return apiClient.get(`/categories/${id}`);
  },

  // Tạo category mới
  create: async (categoryData) => {
    return apiClient.post('/categories', categoryData);
  },

  // Cập nhật category
  update: async (id, categoryData) => {
    return apiClient.patch(`/categories/${id}`, categoryData);
  },

  // Xóa category
  delete: async (id) => {
    return apiClient.delete(`/categories/${id}`);
  },

  // Lấy category với products
  getWithProducts: async (id, params = {}) => {
    return apiClient.get(`/categories/${id}/products`, params);
  },

  // Lấy categories nổi bật
  getFeatured: async (limit = 10) => {
    return apiClient.get('/categories', { 
      featured: true,
      _limit: limit 
    });
  },

  // Lấy categories theo slug
  getBySlug: async (slug) => {
    return apiClient.get('/categories', { slug });
  }
}; 