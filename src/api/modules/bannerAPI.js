import apiClient from '../client.js';

// ===== BANNER API =====
export const bannerAPI = {
  // Lấy tất cả banner
  getBanners: async (params = {}) => {
    try {
      const response = await apiClient.get('/banners', params);
      return response.data;
    } catch (error) {
      console.error('Get banners error:', error);
      throw error;
    }
  },

  // Lấy banner theo ID
  getBannerById: async (id) => {
    try {
      const response = await apiClient.get(`/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get banner by ID error:', error);
      throw error;
    }
  },

  // Tạo banner mới
  createBanner: async (bannerData) => {
    try {
      const response = await apiClient.post('/banners', bannerData);
      return response.data;
    } catch (error) {
      console.error('Create banner error:', error);
      throw error;
    }
  },

  // Cập nhật banner
  updateBanner: async (id, bannerData) => {
    try {
      const response = await apiClient.patch(`/banners/${id}`, bannerData);
      return response.data;
    } catch (error) {
      console.error('Update banner error:', error);
      throw error;
    }
  },

  // Xóa banner
  deleteBanner: async (id) => {
    try {
      const response = await apiClient.delete(`/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete banner error:', error);
      throw error;
    }
  }
}; 