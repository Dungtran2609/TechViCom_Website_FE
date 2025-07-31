import apiClient from '../client.js';

// ===== CATEGORY API =====
export const categoryAPI = {
  // Lấy tất cả danh mục
  getCategories: async (params = {}) => {
    try {
      const response = await apiClient.get('/categories', params);
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw error;
    }
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.patch(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    try {
      return apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }
}; 