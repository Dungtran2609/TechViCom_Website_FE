import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!form.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      alert('Đặt hàng thành công!');
    }
  };

  // Tính toán tổng tiền, khuyến mãi, cần thanh toán
  const total = product ? product.originalPrice : 21990000;
  const discount = product ? (product.originalPrice - product.price) : 2500000;
  const final = product ? product.price : 19490000;
  const reward = product && product.promotion ? product.promotion : '+4,872';

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Left: Main Content */}
        <form className="flex-1 space-y-6" onSubmit={handleSubmit}>
          {/* Sản phẩm trong đơn */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Sản phẩm trong đơn {product ? '(1)' : ''}</h2>
            {product ? (
              <div className="flex items-center gap-4 border-b pb-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-1">Mã: {product.code || '---'}</div>
                  <div className="mt-2 text-xs text-yellow-600 font-semibold bg-yellow-100 inline-block px-2 py-1 rounded">{product.installment || 'Quà tặng kèm'}</div>
                </div>
                <div className="text-right">
                  <div className="text-red-600 font-bold text-lg">{product.price?.toLocaleString()} đ</div>
                  <div className="text-xs line-through text-gray-400">{product.originalPrice?.toLocaleString()} đ</div>
                  <div className="text-xs text-gray-500">x1</div>
                </div>
              </div>
            ) : (
              <div>Không có sản phẩm</div>
            )}
          </div>

          {/* Người đặt hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Người đặt hàng</h2>
            <div className="space-y-4">
              <div>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Họ và tên" className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : ''}`} />
                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : ''}`} />
                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
              </div>
              <div>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email (Không bắt buộc)" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Hình thức nhận hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Hình thức nhận hàng</h2>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="delivery" className="accent-blue-600" defaultChecked />
                <span>Giao hàng tận nơi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="delivery" className="accent-blue-600" />
                <span>Nhận tại cửa hàng</span>
              </label>
            </div>
            <div className="flex gap-4 mb-4">
              <input type="text" placeholder="Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã" className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Ghi chú (VD: Hãy gọi tôi khi hàng sắp đến)" className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-blue-600" />
                <span>Người nhận khác người đặt</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-blue-600" />
                <span>Yêu cầu tư vấn trả góp</span>
              </label>
            </div>
          </div>

          {/* Xuất hóa đơn điện tử */}
          <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
            <span className="font-medium">Xuất hóa đơn điện tử</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 transition-all"></div>
              <span className="ml-3 text-sm text-gray-500"> </span>
            </label>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-lg mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Thanh toán khi nhận hàng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Thanh toán bằng QR Code, thẻ ATM nội địa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Thanh toán thẻ quốc tế Visa, Master, JCB, AMEX, Apple Pay, Google Pay, Samsung Pay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Ngân hàng iBank</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Ngân hàng Quốc dân (NCB)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>MoMo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>ZaloPay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Trả góp qua thẻ tín dụng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="payment" className="accent-blue-600" />
                <span>Trả góp qua công ty tài chính</span>
              </label>
            </div>
          </div>
          {/* Submit button nằm ngoài cùng */}
        </form>
        {/* Right: Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">Thông tin đơn hàng</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tổng tiền</span>
                <span className="font-medium">{total?.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng khuyến mãi</span>
                <span className="text-green-600">{discount?.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="text-blue-600">Miễn phí</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t mt-2">
                <span>Cần thanh toán</span>
                <span className="text-red-600">{final?.toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between">
                <span>Điểm thưởng</span>
                <span className="text-yellow-600">{reward}</span>
              </div>
            </div>
            <button type="submit" form="checkout-form" className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg text-lg transition">Đặt hàng</button>
            <div className="text-xs text-gray-500 mt-4 text-center">
              Bằng việc nhấn đặt mua, bạn đồng ý với <a href="#" className="text-blue-600 underline">chính sách xử lý dữ liệu cá nhân</a> và <a href="#" className="text-blue-600 underline">điều khoản sử dụng</a> của FPT Shop
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 