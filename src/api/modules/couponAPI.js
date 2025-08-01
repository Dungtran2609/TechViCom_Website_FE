import apiClient from '../client.js';

// ===== COUPON API =====
export const couponAPI = {
  // Lấy tất cả coupon
  getCoupons: async (params = {}) => {
    try {
      const response = await apiClient.get('/coupons', params);
      return response;
    } catch (error) {
      console.error('Get coupons error:', error);
      throw error;
    }
  },

  // Lấy coupon theo ID
  getCouponById: async (id) => {
    try {
      const response = await apiClient.get(`/coupons/${id}`);
      return response;
    } catch (error) {
      console.error('Get coupon by ID error:', error);
      throw error;
    }
  },

  // Tạo coupon mới
  createCoupon: async (couponData) => {
    try {
      const response = await apiClient.post('/coupons', couponData);
      return response;
    } catch (error) {
      console.error('Create coupon error:', error);
      throw error;
    }
  },

  // Cập nhật coupon
  updateCoupon: async (id, couponData) => {
    try {
      const response = await apiClient.patch(`/coupons/${id}`, couponData);
      return response;
    } catch (error) {
      console.error('Update coupon error:', error);
      throw error;
    }
  },

  // Xóa coupon
  deleteCoupon: async (id) => {
    try {
      const response = await apiClient.delete(`/coupons/${id}`);
      return response;
    } catch (error) {
      console.error('Delete coupon error:', error);
      throw error;
    }
  }
};
