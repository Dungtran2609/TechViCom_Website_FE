import apiClient from '../client.js';

// ===== VOUCHER API =====
export const voucherAPI = {
  // Validate voucher
  validateVoucher: async (code, totalAmount = 0) => {
    try {
      const response = await apiClient.get('/vouchers', { code });
      const vouchers = Array.isArray(response) ? response : [response];
      const voucher = vouchers.find(v => v.code === code);
      
      if (!voucher) {
        return {
          valid: false,
          message: 'Mã voucher không tồn tại'
        };
      }
      
      // Kiểm tra voucher có hợp lệ không
      const now = new Date();
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      
      if (now < startDate) {
        return {
          valid: false,
          message: 'Voucher chưa có hiệu lực'
        };
      }
      
      if (now > endDate) {
        return {
          valid: false,
          message: 'Voucher đã hết hạn'
        };
      }
      
      if (voucher.usedCount >= voucher.usageLimit) {
        return {
          valid: false,
          message: 'Voucher đã hết lượt sử dụng'
        };
      }
      
      // Kiểm tra giá trị đơn hàng tối thiểu
      if (totalAmount < voucher.minOrderValue) {
        return {
          valid: false,
          message: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để sử dụng voucher này`
        };
      }
      
      return {
        valid: true,
        voucher: voucher,
        message: 'Voucher hợp lệ'
      };
    } catch (error) {
      console.error('Validate voucher error:', error);
      return {
        valid: false,
        message: 'Có lỗi xảy ra khi kiểm tra voucher'
      };
    }
  },

  // Lấy voucher theo code
  getVoucherByCode: async (code) => {
    try {
      const response = await apiClient.get('/vouchers', { code });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.error('Get voucher by code error:', error);
      throw error;
    }
  },

  // Lấy tất cả voucher
  getAllVouchers: async (params = {}) => {
    try {
      const response = await apiClient.get('/vouchers', params);
      return response;
    } catch (error) {
      console.error('Get all vouchers error:', error);
      throw error;
    }
  },

  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    try {
      const response = await apiClient.post('/vouchers', voucherData);
      return response;
    } catch (error) {
      console.error('Create voucher error:', error);
      throw error;
    }
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await apiClient.patch(`/vouchers/${id}`, voucherData);
      return response;
    } catch (error) {
      console.error('Update voucher error:', error);
      throw error;
    }
  },

  // Xóa voucher
  deleteVoucher: async (id) => {
    try {
      return apiClient.delete(`/vouchers/${id}`);
    } catch (error) {
      console.error('Delete voucher error:', error);
      throw error;
    }
  }
}; 