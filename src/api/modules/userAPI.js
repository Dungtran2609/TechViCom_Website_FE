// File: src/api/modules/userAPI.js (Bản hoàn chỉnh cho Phương án B - Dùng ApiClient)

import ApiClient from '../client'; // ✅ BƯỚC 1: IMPORT ApiClient

export const userAPI = {
  /**
   * Đăng nhập người dùng.
   */
  login: (credentials) => {
    // Nó sẽ truyền thẳng đối tượng này cho ApiClient
    return ApiClient.post('/login', credentials);
  },

  /**
   * Đăng ký người dùng mới.
   */
  register: (name, email, password, password_confirmation) => {
    return ApiClient.post('/register', { name, email, password, password_confirmation });
  },

  /**
   * Đăng xuất người dùng.
   * ApiClient sẽ tự động đính kèm token.
   */
  logout: () => {
    return ApiClient.post('/logout');
  },

  /**
   * Lấy thông tin của người dùng hiện tại.
   * ApiClient sẽ tự động đính kèm token.
   */
  getMe: () => {
    return ApiClient.get('/me');
  },

  /**
   * Cập nhật thông tin người dùng.
   * ApiClient sẽ tự động đính kèm token.
   */
  updateUser: (userId, updateData) => {
    return ApiClient.put(`/users/${userId}`, updateData);
  },
};