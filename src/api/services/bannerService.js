import apiClient from '../client.js';

// Banner Service
export const bannerService = {
  // Lấy danh sách tất cả banners
  getAll: async (params = {}) => {
    return apiClient.get('/banners', params);
  },

  // Lấy banner theo ID
  getById: async (id) => {
    return apiClient.get(`/banners/${id}`);
  },

  // Tạo banner mới
  create: async (bannerData) => {
    return apiClient.post('/banners', bannerData);
  },

  // Cập nhật banner
  update: async (id, bannerData) => {
    return apiClient.patch(`/banners/${id}`, bannerData);
  },

  // Xóa banner
  delete: async (id) => {
    return apiClient.delete(`/banners/${id}`);
  },

  // Lấy banners đang hoạt động
  getActive: async () => {
    return apiClient.get('/banners', { active: true });
  },

  // Lấy banners theo vị trí
  getByPosition: async (position) => {
    return apiClient.get('/banners', { position });
  }
}; 