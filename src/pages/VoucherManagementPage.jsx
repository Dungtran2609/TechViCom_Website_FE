import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaEdit, FaTrash, FaPlus, FaEye, FaTimes } from 'react-icons/fa';
import { getVouchers } from '../api/vouchers';

const VoucherManagementPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (voucher) => {
    const currentDate = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    
    if (!voucher.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Vô hiệu hóa</span>;
    }
    
    if (currentDate < startDate) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">Chưa có hiệu lực</span>;
    }
    
    if (currentDate > endDate) {
      return <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">Hết hạn</span>;
    }
    
    if (voucher.usedCount >= voucher.usageLimit) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">Hết lượt</span>;
    }
    
    return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Hoạt động</span>;
  };

  const getDiscountText = (voucher) => {
    switch (voucher.discountType) {
      case 'percentage':
        return `${voucher.discountValue}%`;
      case 'fixed':
        return `${voucher.discountValue.toLocaleString()}đ`;
      case 'shipping':
        return 'Miễn phí vận chuyển';
      default:
        return 'Không xác định';
    }
  };

  const handleViewVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Voucher</h1>
          <p className="text-gray-600">Quản lý các mã giảm giá và khuyến mãi</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Danh sách Voucher</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                <FaPlus />
                Thêm voucher mới
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã voucher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại giảm giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điều kiện</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sử dụng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaTicketAlt className="text-orange-500 mr-2" />
                        <span className="font-mono text-sm font-medium text-gray-900">{voucher.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{voucher.name}</div>
                      <div className="text-sm text-gray-500">{voucher.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{getDiscountText(voucher)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Tối thiểu: {voucher.minOrderValue.toLocaleString()}đ
                      </div>
                      <div className="text-sm text-gray-500">
                        Tối đa: {voucher.maxDiscount.toLocaleString()}đ
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {voucher.usedCount}/{voucher.usageLimit}
                      </div>
                      <div className="text-sm text-gray-500">
                        {((voucher.usedCount / voucher.usageLimit) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(voucher)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewVoucher(voucher)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal chi tiết voucher */}
      {showModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết Voucher</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Mã voucher</label>
                <p className="text-lg font-mono text-gray-900">{selectedVoucher.code}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Tên voucher</label>
                <p className="text-gray-900">{selectedVoucher.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Mô tả</label>
                <p className="text-gray-900">{selectedVoucher.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Loại giảm giá</label>
                  <p className="text-gray-900">{getDiscountText(selectedVoucher)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                  <div className="mt-1">{getStatusBadge(selectedVoucher)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Đơn hàng tối thiểu</label>
                  <p className="text-gray-900">{selectedVoucher.minOrderValue.toLocaleString()}đ</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Giảm giá tối đa</label>
                  <p className="text-gray-900">{selectedVoucher.maxDiscount.toLocaleString()}đ</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                  <p className="text-gray-900">{new Date(selectedVoucher.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày kết thúc</label>
                  <p className="text-gray-900">{new Date(selectedVoucher.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Đã sử dụng</label>
                  <p className="text-gray-900">{selectedVoucher.usedCount}/{selectedVoucher.usageLimit}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Danh mục áp dụng</label>
                  <p className="text-gray-900">
                    {selectedVoucher.applicableCategories.includes('all') 
                      ? 'Tất cả sản phẩm' 
                      : selectedVoucher.applicableCategories.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagementPage; 