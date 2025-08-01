import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT hoặc Sanctum token
        const response = await fetch('http://localhost:8000/api/v1/order', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi gọi API');
        }

        const data = await response.json();
        setOrders([...data].reverse()); // đơn mới nhất lên đầu
      } catch (error) {
        console.error('Không thể tải đơn hàng:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-10 px-2 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Đơn hàng của bạn</h1>

        {loading ? (
          <p className="text-center text-gray-600">Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 text-lg">
            Bạn chưa có đơn hàng nào.<br />
            <Link to="/" className="text-orange-500 font-semibold hover:underline">Về trang chủ</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div
                key={order.id || idx}
                className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-semibold text-base text-gray-900">
                    Mã đơn: <span className="text-orange-500">{order.id}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Ngày đặt: {new Date(order.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Tổng tiền: <span className="text-red-500 font-semibold">{order.total_price?.toLocaleString()}₫</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Số sản phẩm: {order.order_items?.length || 0}
                  </div>
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded text-base shadow transition"
                  onClick={() => navigate(`/order/${order.id}`)}
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
