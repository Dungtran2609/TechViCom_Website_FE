import apiClient from '../client.js';

// Product Service
export const productService = {
  // Lấy danh sách sản phẩm với filter
  getProducts: async (filters = {}) => {
    return apiClient.get('/products', filters);
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    return apiClient.post('/products', productData);
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    return apiClient.patch(`/products/${id}`, productData);
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query, filters = {}) => {
    return apiClient.get('/products', { 
      q: query,
      ...filters 
    });
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category, filters = {}) => {
    return apiClient.get('/products', { 
      category,
      ...filters 
    });
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 10) => {
    return apiClient.get('/products', { 
      featured: true,
      _limit: limit 
    });
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: async (limit = 10) => {
    return apiClient.get('/products', { 
      _sort: 'createdAt',
      _order: 'desc',
      _limit: limit 
    });
  }
}; 