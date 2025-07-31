import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/order/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể kết nối đến máy chủ');
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(err => {
        console.error('Lỗi lấy dữ liệu đơn hàng:', err);
        alert('Không thể tải đơn hàng.');
        navigate('/orders');
      });
  }, [id]);

  const translateStatus = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã giao hàng';
      case 'delivered': return 'Đã giao thành công';
      case 'cancelled': return 'Đã hủy';
      case 'returned': return 'Đã trả hàng';
      default: return status;
    }
  };

  const translatePaymentMethod = (method) => {
    switch (method?.toLowerCase()) {
      case 'credit_card': return 'Thẻ tín dụng/ghi nợ';
      case 'bank_transfer': return 'Chuyển khoản ngân hàng';
      case 'cod': return 'Thanh toán khi nhận hàng';
      // case 'vnpay': return 'VNPAY';
      default: return method || 'Không xác định';
    }
  };

  if (!order) return <div className="p-6 text-center text-gray-600">Đang tải đơn hàng...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 border-b pb-2">📦 Chi tiết đơn hàng #{order.id}</h2>

      {/* Thông tin chung */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm text-gray-700">
        <div>
          <p><strong>🟡 Trạng thái:</strong> {translateStatus(order.status)}</p>
          <p><strong>📅 Ngày đặt:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>🔄 Cập nhật gần nhất:</strong> {new Date(order.updated_at).toLocaleString()}</p>
          <p><strong>🚚 Giao hàng lúc:</strong> {order.shipped_at ? new Date(order.shipped_at).toLocaleString() : 'Chưa giao'}</p>
        </div>
        <div>
          <p><strong>👤 Người nhận:</strong> {order.recipient_name}</p>
          <p><strong>📞 Số điện thoại:</strong> {order.recipient_phone}</p>
          <p>
            <strong>📍 Địa chỉ:</strong>
            {order.recipient_address}, {order.ward_name}, {order.district_name}, {order.province_name}
          </p>
          {/* <p><strong>📍 Địa chỉ:</strong> {order.recipient_address}</p> */}
        </div>
      </section>

      {/* Danh sách sản phẩm */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🛒 Danh sách sản phẩm</h3>
        <div className="border rounded divide-y">
          {order.items && order.items.length > 0 ? (
            order.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover rounded border" />
                  <div>
                    <p className="font-medium text-gray-800">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Biến thể: {item.variant_name || 'Không có'}</p>
                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Đơn giá: <span className="font-semibold text-gray-800">{Number(item.unit_price).toLocaleString()}₫</span></p>
                  <p>Thành tiền: <span className="font-semibold text-blue-600">{Number(item.total_price).toLocaleString()}₫</span></p>
                </div>
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500">Không có sản phẩm.</p>
          )}
        </div>
      </section>

      {/* Thông tin thanh toán */}
      <section className="mb-6 text-sm text-gray-700 space-y-1">
        <p><strong>🚛 Phí vận chuyển:</strong> {Number(order.shipping_fee).toLocaleString()}₫</p>
        <p><strong>💵 Tổng tiền sản phẩm:</strong> {Number(order.total_amount).toLocaleString()}₫</p>
        <p><strong>💳 Tổng thanh toán:</strong> <span className="text-lg font-bold text-green-600">{Number(order.final_total).toLocaleString()}₫</span></p>
        <p><strong>📦 Khối lượng đơn:</strong> {order.total_weight} kg</p>
        {/* <p><strong>💰 Mã giảm giá:</strong> {order.coupon_id ?? 'Không có'}</p> */}
        {order.coupon_discount > 0 && (
          <p><strong>💰 Mã giảm giá:</strong> {order.coupon_code || order.coupon_id} (-{Number(order.coupon_discount).toLocaleString()}₫)</p>
        )}

        
        

        <p><strong>🧾 Phương thức thanh toán:</strong> {translatePaymentMethod(order.payment_method)}</p>
      </section>

      {/* Nút điều hướng */}
      <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="w-full md:w-auto px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded shadow"
        >
          ← Quay lại danh sách
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
        >
          Về trang chủ →
        </button>
      </div>
    </div>
  );
}
