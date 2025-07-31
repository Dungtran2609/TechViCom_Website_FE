import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset state khi user thay đổi
    setOrders([]);
    
    const user = JSON.parse(localStorage.getItem('user'));
    setOrders(user && user.orders ? [...user.orders].reverse() : []);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-10 px-2 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Đơn hàng của bạn</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 text-lg">
            Bạn chưa có đơn hàng nào.<br />
            <Link to="/" className="text-orange-500 font-semibold hover:underline">Về trang chủ</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-base text-gray-900">Mã đơn: <span className="text-orange-500">{order.createdAt ? order.createdAt.replace(/[-:T.]/g, '').slice(0,14) : (order.orderId || 'N/A')}</span></div>
                  <div className="text-sm text-gray-600">Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString() : (order.date || '')}</div>
                  <div className="text-sm text-gray-600">Tổng tiền: <span className="text-red-500 font-semibold">{order.total?.toLocaleString()}₫</span></div>
                  <div className="text-sm text-gray-600">Số sản phẩm: {order.items ? order.items.length : (order.products ? order.products.length : 0)}</div>
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded text-base shadow transition"
                  onClick={() => navigate(`/order/${order.createdAt || order.orderId}`)}
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 