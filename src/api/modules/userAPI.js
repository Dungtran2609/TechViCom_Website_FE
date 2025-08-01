// File: src/api/modules/userAPI.js (Bản hoàn chỉnh cho Phương án B - Dùng ApiClient)

import ApiClient from '../client'; // ✅ BƯỚC 1: IMPORT ApiClient

export const userAPI = {
  /**
   * Đăng nhập người dùng.
   */
  login: (email, password) => {
    // ApiClient sẽ tự động thêm http://127.0.0.1:8000
    // File này chỉ cần cung cấp phần endpoint
    return ApiClient.post('/api/v1/login', { email, password });
  },

  /**
   * Đăng ký người dùng mới.
   */
  register: (name, email, password, password_confirmation) => {
    return ApiClient.post('/api/v1/register', { name, email, password, password_confirmation });
  },

  /**
   * Đăng xuất người dùng.
   * ApiClient sẽ tự động đính kèm token.
   */
  logout: () => {
    return ApiClient.post('/api/v1/logout');
  },

  /**
   * Lấy thông tin của người dùng hiện tại.
   * ApiClient sẽ tự động đính kèm token.
   */
  getMe: () => {
    return ApiClient.get('/api/v1/me');
  },

  /**
   * Cập nhật thông tin người dùng.
   * ApiClient sẽ tự động đính kèm token.
   */
  updateUser: (userId, updateData) => {
    return ApiClient.put(`/api/v1/users/${userId}`, updateData);
  },
};