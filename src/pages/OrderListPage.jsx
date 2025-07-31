import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/order');
        const data = await response.json();
        setOrders(data.reverse());
      } catch (error) {
        console.error('Lỗi gọi API đơn hàng:', error);
      }
    };

    fetchOrders();
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
              {orders.map((order) => {
                console.log(order); // 
              const totalQuantity = order.items?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
              const totalProductPrice = order.items?.reduce((sum, item) => sum + Number(item.total_price), 0) || 0;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-base text-gray-900">
                      Mã đơn: <span className="text-orange-500">{order.order_code || order.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày đặt: {new Date(order.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tổng tiền sản phẩm:
                      <span className="text-blue-600 font-semibold ml-1">
                        {totalProductPrice.toLocaleString()}₫
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Thành tiền:
                      <span className="text-red-500 font-semibold ml-1">
                        {Number(order.final_price || 0).toLocaleString()}₫
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Số sản phẩm: <span className="font-medium ml-1">{totalQuantity}</span>
                    </p>
                  </div>

                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded text-base shadow transition"
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
