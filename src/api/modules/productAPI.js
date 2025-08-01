// File: src/api/modules/productAPI.js (Bản tối ưu cho Phương án B)

import apiClient from '../client.js';

export const productAPI = {
  // Lấy tất cả sản phẩm (paginated, sorted, active, with relations)
  getProducts: async (params = {}) => {
    try {
      // params can include page, per_page, etc. (for pagination)
      const response = await apiClient.get('/products', params);
      // Laravel returns pagination info in response.data
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID (with relations)
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }
};