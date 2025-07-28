import apiClient from '../client.js';

// Voucher Service
export const voucherService = {
  // Lấy danh sách voucher
  getVouchers: async (params = {}) => {
    return apiClient.get('/vouchers', params);
  },

  // Lấy voucher theo ID
  getVoucherById: async (id) => {
    return apiClient.get(`/vouchers/${id}`);
  },

  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    return apiClient.post('/vouchers', voucherData);
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    return apiClient.patch(`/vouchers/${id}`, voucherData);
  },

  // Xóa voucher
  deleteVoucher: async (id) => {
    return apiClient.delete(`/vouchers/${id}`);
  },

  // Validate voucher
  validateVoucher: async (code, cartItems, totalAmount) => {
    try {
      const vouchers = await apiClient.get('/vouchers');
      const voucher = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
      
      if (!voucher) {
        return { valid: false, message: 'Mã voucher không tồn tại' };
      }
      
      if (!voucher.isActive) {
        return { valid: false, message: 'Voucher đã bị vô hiệu hóa' };
      }
      
      const currentDate = new Date();
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      
      if (currentDate < startDate || currentDate > endDate) {
        return { valid: false, message: 'Voucher đã hết hạn hoặc chưa có hiệu lực' };
      }
      
      if (voucher.usedCount >= voucher.usageLimit) {
        return { valid: false, message: 'Voucher đã hết lượt sử dụng' };
      }
      
      if (totalAmount < voucher.minOrderValue) {
        return { 
          valid: false, 
          message: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để sử dụng voucher này` 
        };
      }
      
      // Kiểm tra danh mục áp dụng
      if (!voucher.applicableCategories.includes('all')) {
        const cartCategories = [...new Set(cartItems.map(item => item.category))];
        const hasApplicableCategory = cartCategories.some(category => 
          voucher.applicableCategories.includes(category)
        );
        
        if (!hasApplicableCategory) {
          return { valid: false, message: 'Voucher không áp dụng cho sản phẩm trong giỏ hàng' };
        }
      }
      
      return { valid: true, voucher };
    } catch (error) {
      console.error('Error validating voucher:', error);
      return { valid: false, message: 'Có lỗi xảy ra khi kiểm tra voucher' };
    }
  },

  // Tính toán giảm giá
  calculateDiscount: (voucher, totalAmount) => {
    let discountAmount = 0;
    
    switch (voucher.discountType) {
      case 'percentage':
        discountAmount = (totalAmount * voucher.discountValue) / 100;
        break;
      case 'fixed':
        discountAmount = voucher.discountValue;
        break;
      case 'shipping':
        discountAmount = voucher.discountValue;
        break;
      default:
        discountAmount = 0;
    }
    
    // Giới hạn mức giảm giá tối đa
    if (discountAmount > voucher.maxDiscount) {
      discountAmount = voucher.maxDiscount;
    }
    
    return discountAmount;
  },

  // Cập nhật số lượt sử dụng voucher
  updateVoucherUsage: async (voucherId, currentUsedCount) => {
    return apiClient.patch(`/vouchers/${voucherId}`, { 
      usedCount: currentUsedCount + 1 
    });
  },

  // Lấy voucher theo mã
  getVoucherByCode: async (code) => {
    const vouchers = await apiClient.get('/vouchers');
    return vouchers.find(v => v.code.toUpperCase() === code.toUpperCase());
  }
}; 