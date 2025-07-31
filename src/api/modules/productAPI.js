import apiClient from '../client.js';

// ===== PRODUCT API =====
export const productAPI = {
  // Lấy tất cả sản phẩm
  getProducts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/products', filters);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.patch(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      return apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/products', { 
        q: query,
        ...filters 
      });
      return response;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category, filters = {}) => {
    try {
      const response = await apiClient.get('/products', { 
        category,
        ...filters 
      });
      return response;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get('/products', { 
        featured: true,
        _limit: limit 
      });
      return response;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get('/products', { 
        _sort: 'createdAt',
        _order: 'desc',
        _limit: limit 
      });
      return response;
    } catch (error) {
      console.error('Get latest products error:', error);
      throw error;
    }
  }
}; 