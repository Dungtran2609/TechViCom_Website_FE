import apiClient from '../client.js';

// User Service
export const userService = {
  // Lấy thông tin user theo ID
  getUser: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  // Lấy danh sách tất cả users
  getAllUsers: async (params = {}) => {
    return apiClient.get('/users', params);
  },

  // Đăng nhập
  login: async (phone, password) => {
    return apiClient.get('/users', { phone, password });
  },

  // Đăng ký
  register: async (userData) => {
    return apiClient.post('/users', userData);
  },

  // Cập nhật thông tin user
  updateUser: async (id, userData) => {
    return apiClient.patch(`/users/${id}`, userData);
  },

  // Xóa user
  deleteUser: async (id) => {
    return apiClient.delete(`/users/${id}`);
  },

  // Kiểm tra thông tin user có đầy đủ không
  checkUserMissingInfo: (user) => {
    if (!user) return true;
    if (!user.name || !user.birthday || !user.gender || !user.avatar) return true;
    if (!user.addresses || user.addresses.length === 0 || !user.addresses[0].address) return true;
    return false;
  }
}; 