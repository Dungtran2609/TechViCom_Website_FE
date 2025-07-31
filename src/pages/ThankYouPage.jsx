import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

// Helper để lấy thông tin người dùng hiện tại
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state khi user thay đổi
    setLatestOrder(null);
    setLoading(true);
    
    const user = getCurrentUser();
    // Lấy đơn hàng cuối cùng trong danh sách đơn hàng của người dùng
    if (user && user.orders && user.orders.length > 0) {
      setLatestOrder(user.orders[user.orders.length - 1]);
    }
    setLoading(false);

    // Tự động chuyển về trang chủ sau 10 giây
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    // Cleanup: hủy timer nếu component bị unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return <div className="text-center py-20">Đang tải thông tin đơn hàng...</div>;
  }

  if (!latestOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-red-500">Không tìm thấy thông tin đơn hàng!</h1>
            <p className="mt-4 text-gray-600">Có thể đã xảy ra lỗi hoặc bạn chưa đặt hàng.</p>
            <Link to="/account" className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              Xem Lịch Sử Đơn Hàng
            </Link>
          </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-10 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-5 animate-pulse" />
          <h1 className="text-3xl font-bold text-gray-800">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p>
          <p className="text-sm text-gray-500 mt-1">
            Mã đơn hàng của bạn là: <strong className="text-orange-600 font-mono">{latestOrder.orderId}</strong>
          </p>

          <div className="my-8 border-t border-b border-gray-200 py-6">
            <h3 className="text-xl font-semibold mb-4 text-left text-gray-700">Chi tiết đơn hàng</h3>
            <div className="space-y-4">
              {latestOrder.products.map((product, index) => (
                <div key={index} className="flex justify-between items-center text-left">
                  <div>
                    <p className="font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">Số lượng: {product.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">{product.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t font-bold text-lg">
              <span className="text-gray-900">Tổng cộng</span>
              <span className="text-red-600">{latestOrder.total.toLocaleString()}₫</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/" className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition shadow hover:shadow-lg">
              Tiếp tục mua sắm
            </Link>
            <Link to="/account" className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-800 font-semibold rounded-lg hover:bg-slate-200 transition">
              Xem lịch sử đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;