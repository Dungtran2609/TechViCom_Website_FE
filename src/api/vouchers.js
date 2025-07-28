// Voucher API functions - Tương thích với code cũ và mới
import { voucherService } from './services/voucherService.js';

// Export các function cũ để tương thích
export const getVouchers = async () => {
  return voucherService.getVouchers();
};

export const validateVoucher = async (code, cartItems, totalAmount) => {
  return voucherService.validateVoucher(code, cartItems, totalAmount);
};

export const calculateDiscount = (voucher, totalAmount) => {
  return voucherService.calculateDiscount(voucher, totalAmount);
};

export const updateVoucherUsage = async (voucherId, currentUsedCount) => {
  return voucherService.updateVoucherUsage(voucherId, currentUsedCount);
};

export const getVoucherByCode = async (code) => {
  return voucherService.getVoucherByCode(code);
};

// Export service mới
export { voucherService }; 