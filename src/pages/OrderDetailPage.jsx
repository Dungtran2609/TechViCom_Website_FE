import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = orders.find(o => o.createdAt === id);
    setOrder(found);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 text-lg">
          Không tìm thấy đơn hàng.<br />
          <Link to="/orders" className="text-orange-500 font-semibold hover:underline">Về danh sách đơn hàng</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-2 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Chi tiết đơn hàng</h1>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="font-semibold text-base text-gray-900 mb-2">Mã đơn: <span className="text-orange-500">{order.createdAt.replace(/[-:T.]/g, '').slice(0,14)}</span></div>
          <div className="text-sm text-gray-600 mb-1">Ngày đặt: {new Date(order.createdAt).toLocaleString()}</div>
          <div className="text-sm text-gray-600 mb-1">Tổng tiền: <span className="text-red-500 font-semibold">{order.total.toLocaleString()}₫</span></div>
          <div className="text-sm text-gray-600 mb-1">Họ tên: {order.name}</div>
          <div className="text-sm text-gray-600 mb-1">SĐT: {order.phone}</div>
          <div className="text-sm text-gray-600 mb-1">Email: {order.email || '---'}</div>
          <div className="text-sm text-gray-600 mb-1">Địa chỉ: {order.address}, {order.addressDetail}</div>
          <div className="text-sm text-gray-600 mb-1">Ghi chú: {order.note || '---'}</div>
          <div className="text-sm text-gray-600 mb-1">Hình thức nhận: {order.delivery}</div>
          <div className="text-sm text-gray-600 mb-1">Thanh toán: {order.payment}</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-gray-800 text-base mb-4">Sản phẩm trong đơn ({order.items.length})</h2>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 border-b pb-3 last:border-b-0">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.storage}</div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-red-500 font-semibold text-base">{item.price.toLocaleString()}₫</div>
                  <div className="text-xs text-gray-500">x{item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Link to="/orders" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded text-base shadow transition">Quay lại danh sách</Link>
          <Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded text-base shadow transition">Về trang chủ</Link>
        </div>
      </div>
    </div>
  );
} 