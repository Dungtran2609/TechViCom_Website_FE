import apiClient from '../client.js';

// ===== USER API =====
export const userAPI = {
  // Đăng nhập
  login: async (phone, password) => {
    try {
      const response = await apiClient.get('/users');
      const users = Array.isArray(response) ? response : [response];
      const user = users.find(u => u.phone === phone && u.password === password);
      
      if (!user) {
        throw new Error('Sai tài khoản hoặc mật khẩu');
      }
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Lấy thông tin user
  getUser: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.patch(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Xóa user
  deleteUser: async (id) => {
    try {
      return apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // Lấy tất cả users
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/users', params);
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // Kiểm tra thông tin user có đầy đủ không
  checkUserMissingInfo: (user) => {
    if (!user) return true;
    if (!user.name || !user.birthday || !user.gender || !user.avatar) return true;
    if (!user.addresses || user.addresses.length === 0 || !user.addresses[0].address) return true;
    return false;
  }
}; 