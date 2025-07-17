import React, { useEffect, useState } from "react";
import { products } from '../data/products';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    addressDetail: '',
    note: '',
    delivery: 'Giao hàng tận nơi',
    payment: '',
    invoice: false,
    confirmCall: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const buyNowId = query.get('buyNow');
    const buyNowStorage = query.get('storage');
    if (buyNowId) {
      // Chế độ mua ngay: chỉ render đúng 1 sản phẩm
      const product = products.find(p => String(p.id) === String(buyNowId));
      let variant = null;
      if (product && product.variants && buyNowStorage) {
        variant = product.variants.find(v => v.storage === buyNowStorage);
      }
      setCartItems(product ? [{
        id: product.id,
        name: product.name,
        image: product.image,
        price: variant ? variant.price : (product.price || 0),
        originalPrice: product.originalPrice || 0,
        storage: variant ? variant.storage : (buyNowStorage || ''),
        quantity: 1
      }] : []);
    } else {
      // Chế độ checkout giỏ hàng như cũ
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const mapped = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const variant = product && product.variants ? product.variants.find(v => v.storage === item.variant.storage) : null;
        return {
          ...item,
          name: product ? product.name : '',
          image: product ? product.image : '',
          price: variant ? variant.price : (product ? product.price : 0),
          originalPrice: product ? product.originalPrice : 0,
          storage: variant ? variant.storage : (item.variant ? item.variant.storage : ''),
        };
      });
      setCartItems(mapped);
    }
  }, [query]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const totalSave = totalOriginal - total;

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!/^0\d{9,10}$/.test(form.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'Email không hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!form.addressDetail.trim()) newErrors.addressDetail = 'Vui lòng nhập địa chỉ chi tiết';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    return newErrors;
  };

  // Xử lý đặt hàng
  const handleOrder = () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      // Lưu đơn hàng vào localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({
        ...form,
        items: cartItems,
        total,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('orders', JSON.stringify(orders));
      // Xóa giỏ hàng
      localStorage.removeItem('cart');
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/thankyou');
      }, 1800);
    }, 1200);
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24 pb-6">
      <div className="max-w-6xl mx-auto checkout-sticky-parent flex gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6 lg:mr-112">
          {/* Sản phẩm trong đơn */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Sản phẩm trong đơn {cartItems.length ? `(${cartItems.length})` : ''}</h2>
            {cartItems.length === 0 ? (
              <div className="text-gray-500">Không có sản phẩm nào trong đơn.</div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b pb-3 last:border-b-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.storage}</div>
                      <div className="text-xs text-gray-500 line-through">{item.originalPrice.toLocaleString()}₫</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-red-500 font-semibold text-base">{item.price.toLocaleString()}₫</div>
                      <div className="text-xs text-gray-500">x{item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Người đặt hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Người đặt hàng</h2>
            <div className="space-y-3">
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Họ và tên" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              {errors.name && <div className="text-red-500 text-xs">{errors.name}</div>}
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
              {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Email (không bắt buộc)" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
            </div>
          </div>

          {/* Hình thức nhận hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Hình thức nhận hàng</h2>
            <div className="flex gap-4 mb-4">
              <button type="button" className={`flex-1 border ${form.delivery === 'Giao hàng tận nơi' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-500'} rounded px-4 py-2 font-medium text-sm`} onClick={() => setForm(f => ({...f, delivery: 'Giao hàng tận nơi'}))}>Giao hàng tận nơi</button>
              <button type="button" className={`flex-1 border ${form.delivery === 'Nhận tại cửa hàng' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-gray-300 text-gray-500'} rounded px-4 py-2 font-medium text-sm`} onClick={() => setForm(f => ({...f, delivery: 'Nhận tại cửa hàng'}))}>Nhận tại cửa hàng</button>
            </div>
            <input className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
            {errors.address && <div className="text-red-500 text-xs">{errors.address}</div>}
            <input className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Địa chỉ nhận hàng (số nhà, tên đường, tên khu vực)" value={form.addressDetail} onChange={e => setForm(f => ({...f, addressDetail: e.target.value}))} />
            {errors.addressDetail && <div className="text-red-500 text-xs">{errors.addressDetail}</div>}
            <textarea className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Ghi chú khác (không bắt buộc khi nhận hàng)" rows={2} maxLength={170} value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))}></textarea>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" checked={form.invoice} onChange={e => setForm(f => ({...f, invoice: e.target.checked}))} />
                Xuất hóa đơn điện tử
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" checked={form.confirmCall} onChange={e => setForm(f => ({...f, confirmCall: e.target.checked}))} />
                Gọi xác nhận trước khi giao hàng
              </label>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3 text-sm">
              {["Thanh toán khi nhận hàng","Thanh toán quét QR code, ví VNPAY, ZaloPay, Momo, ShopeePay","Thanh toán qua thẻ ATM nội địa/Internet Banking","Thanh toán qua thẻ quốc tế Visa, Master, JCB, AMEX, Apple Pay, Google Pay, Samsung Pay","Thanh toán qua thẻ tín dụng/trả góp qua thẻ tín dụng","Thanh toán qua thẻ ATM trả góp qua thẻ nội địa","Thanh toán qua ví Moca/Grab","Thanh toán qua ví ZaloPay","Thanh toán qua ví ShopeePay"].map((method, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="radio" name="payment" className="accent-red-500" checked={form.payment === method} onChange={() => setForm(f => ({...f, payment: method}))} />
                  {method}
                </label>
              ))}
              {errors.payment && <div className="text-red-500 text-xs">{errors.payment}</div>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-96 checkout-sticky-sidebar">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Thông tin đơn hàng</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Tổng tạm tính</span>
              <span>{totalOriginal.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tiết kiệm</span>
              <span className="text-green-600">{totalSave > 0 ? totalSave.toLocaleString() : 0}₫</span>
            </div>
            <div className="flex justify-between text-base font-semibold mb-2">
              <span>Tổng cộng</span>
              <span className="text-red-500">{total.toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-4">
              <span>Đã bao gồm VAT</span>
              <span>-5.472₫</span>
            </div>
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded text-base" onClick={handleOrder} disabled={loading || cartItems.length === 0}>{loading ? 'Đang xử lý...' : 'Đặt hàng'}</button>
            {success && <div className="text-green-600 text-center mt-3 font-semibold">Đặt hàng thành công! Đang chuyển hướng...</div>}
            <div className="text-xs text-gray-500 mt-3 text-center">Bằng việc đặt hàng, bạn đồng ý với <span className="text-blue-500 underline cursor-pointer">Điều khoản sử dụng</span> và <span className="text-blue-500 underline cursor-pointer">Chính sách bảo mật</span> của chúng tôi.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
