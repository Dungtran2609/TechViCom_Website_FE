const API_BASE_URL = 'http://localhost:3001';

// Lấy danh sách voucher
export const getVouchers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers`);
    if (!response.ok) throw new Error('Failed to fetch vouchers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    return [];
  }
};

// Validate voucher
export const validateVoucher = async (code, cartItems, totalAmount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers`);
    if (!response.ok) throw new Error('Failed to fetch vouchers');
    const vouchers = await response.json();
    
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
};

// Tính toán giảm giá
export const calculateDiscount = (voucher, totalAmount) => {
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
};

// Cập nhật số lượt sử dụng voucher
export const updateVoucherUsage = async (voucherId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers/${voucherId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usedCount: voucher.usedCount + 1 })
    });
    
    if (!response.ok) throw new Error('Failed to update voucher usage');
    return true;
  } catch (error) {
    console.error('Error updating voucher usage:', error);
    return false;
  }
}; 