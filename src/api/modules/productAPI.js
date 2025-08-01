// File: src/api/modules/productAPI.js (Bản tối ưu cho Phương án B)

import apiClient from '../client.js';

export const productAPI = {
  // Lấy tất cả sản phẩm
  getProducts: (filters = {}) => {
    return apiClient.get('/api/v1/products', filters);
  },

  // Lấy sản phẩm theo ID
  getProductById: (id) => {
    return apiClient.get(`/api/v1/products/${id}`);
  },

  // Tạo sản phẩm mới
  createProduct: (productData) => {
    return apiClient.post('/api/v1/products', productData);
  },

  // Cập nhật sản phẩm
  updateProduct: (id, productData) => {
    return apiClient.patch(`/api/v1/products/${id}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct: (id) => {
    return apiClient.delete(`/api/v1/products/${id}`);
  },

  // Tìm kiếm sản phẩm
  searchProducts: (query, filters = {}) => {
    return apiClient.get('/api/v1/products', { 
      q: query,
      ...filters 
    });
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: (category, filters = {}) => {
    return apiClient.get('/api/v1/products', { 
      category,
      ...filters 
    });
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: (limit = 10) => {
    return apiClient.get('/api/v1/products', { 
      featured: true,
      _limit: limit 
    });
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: (limit = 10) => {
    return apiClient.get('/api/v1/products', { 
      _sort: 'createdAt',
      _order: 'desc',
      _limit: limit 
    });
  }
};