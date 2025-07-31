import React, { useState } from 'react';
import { FaTicketAlt, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { voucherAPI } from '../api';
import { useNotificationActions } from './notificationHooks';

// Helper function to calculate discount
const calculateDiscount = (voucher, totalAmount) => {
  switch (voucher.discountType) {
    case 'percentage':
      return Math.min((totalAmount * voucher.discountValue) / 100, voucher.maxDiscount || Infinity);
    case 'fixed':
      return Math.min(voucher.discountValue, totalAmount);
    case 'shipping':
      return voucher.shippingCost || 0;
    default:
      return 0;
  }
};

const VoucherInput = ({ cartItems, totalAmount, onVoucherApplied, appliedVoucher, onVoucherRemoved }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success: showSuccess, error: showError } = useNotificationActions();

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Vui lòng nhập mã voucher');
      return;
    }

    setIsLoading(true);

    try {
              const result = await voucherAPI.validateVoucher(voucherCode, totalAmount);
      
      if (result.valid) {
        const discountAmount = calculateDiscount(result.voucher, totalAmount);
        showSuccess(`Áp dụng thành công! Giảm ${discountAmount.toLocaleString()}đ`, 'Áp dụng voucher thành công');
        onVoucherApplied({
          ...result.voucher,
          discountAmount
        });
        setVoucherCode('');
      } else {
        showError(result.message, 'Voucher không hợp lệ');
      }
    } catch {
      showError('Có lỗi xảy ra khi kiểm tra voucher', 'Lỗi hệ thống');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    onVoucherRemoved();
  };

  const getDiscountText = (voucher) => {
    switch (voucher.discountType) {
      case 'percentage':
        return `Giảm ${voucher.discountValue}%`;
      case 'fixed':
        return `Giảm ${voucher.discountValue.toLocaleString()}đ`;
      case 'shipping':
        return 'Miễn phí vận chuyển';
      default:
        return 'Giảm giá';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaTicketAlt className="text-orange-500" />
        Mã giảm giá
      </h3>
      
      {appliedVoucher ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCheck className="text-green-500 text-lg" />
              <div>
                <p className="font-semibold text-green-800">{appliedVoucher.name}</p>
                <p className="text-sm text-green-600">{getDiscountText(appliedVoucher)}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveVoucher}
              className="text-red-500 hover:text-red-700 p-1"
              title="Xóa voucher"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="flex-1 border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500"
              disabled={isLoading}
            />
            <button
              onClick={handleApplyVoucher}
              disabled={isLoading || !voucherCode.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Áp dụng'}
            </button>
          </div>
          

          
          <div className="flex items-start gap-2 text-xs text-gray-500">
            <FaInfoCircle className="mt-0.5 flex-shrink-0" />
            <div>
              <p>• Mã voucher có thể áp dụng cho một số sản phẩm nhất định</p>
              <p>• Mỗi mã chỉ được sử dụng một lần</p>
              <p>• Voucher có thể có điều kiện về giá trị đơn hàng tối thiểu</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherInput; 