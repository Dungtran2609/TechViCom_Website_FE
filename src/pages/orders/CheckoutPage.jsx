// src/pages/CheckoutPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaTruck, FaStore, FaCreditCard } from 'react-icons/fa';
import VoucherInput from '../../components/VoucherInput';
// ✅ BƯỚC 1: Import API mới và xóa các API không cần thiết ở đây
import { productAPI } from '../../api';
import { orderAPI } from '../../api/modules/orderAPI'; // Import API mới tạo
import { useNotificationActions } from '../../components/notificationHooks';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', addressDetail: '',
    note: '', delivery: 'Giao hàng tận nơi', payment: '',
    invoice: false, confirmCall: true,
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const { success: showSuccess, error: showError } = useNotificationActions();

  // Fetch sản phẩm để hiển thị
  useEffect(() => {
    productAPI.getProducts()
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Điền thông tin người dùng vào form
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: (user.addresses?.find(a => a.isDefault)?.address) || '',
      }));
    }
  }, []);

  // Xây dựng giỏ hàng để hiển thị
  useEffect(() => {
    if (!products.length) return;
   
    const buyNowId = query.get('buyNow');
    const buyNowStorage = query.get('storage');
    if (buyNowId) {
      const product = products.find(p => String(p.id) === String(buyNowId));
      const variant = product?.variants?.find(v => v.storage === buyNowStorage);
      const price = variant?.price ?? product?.price ?? 0;
      setCartItems(product ? [{ ...product, price, storage: variant?.storage || buyNowStorage || '', quantity: 1 }] : []);
    } else {
      const currentUser = getCurrentUser();
      const cart = currentUser?.cart || JSON.parse(localStorage.getItem('cart') || '[]');
      const mapped = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const variant = product?.variants?.find(v => v.storage === item.variant?.storage);
        const price = variant?.price ?? product?.price ?? 0;
        return { ...item, ...product, price, storage: variant?.storage || item.variant?.storage || '' };
      }).filter(item => item.name);
      setCartItems(mapped);
    }
  }, [products, query]);

  // Chuyển hướng sau khi đặt hàng thành công
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/orders', { replace: true }), 2000); // Chuyển đến trang lịch sử đơn hàng
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // ✅ Các phép tính này chỉ dùng để HIỂN THỊ cho người dùng.
  // Server sẽ tính toán lại toàn bộ để đảm bảo bảo mật.
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = form.delivery === 'Giao hàng tận nơi' ? 30000 : 0;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const total = subtotal + shippingFee - voucherDiscount;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!/^\d{9,11}$/.test(form.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'Email không hợp lệ';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    return newErrors;
  };

  const handleVoucherApplied = (voucher) => {
    setAppliedVoucher(voucher);
    showSuccess(`Đã áp dụng voucher ${voucher.code}!`, 'Áp dụng voucher thành công');
  };

  const handleVoucherRemoved = () => {
    setAppliedVoucher(null);
  };


  // ✅ BƯỚC 2: VIẾT LẠI HOÀN TOÀN HÀM handleOrder
  const handleOrder = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showError('Vui lòng kiểm tra lại thông tin đơn hàng!', 'Lỗi nhập liệu');
      return;
    }
    setErrors({});
    setLoading(true);

    const fullDeliveryAddress = form.delivery === 'Giao hàng tận nơi'
        ? `${form.addressDetail}, ${form.address}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
        : form.address;

    // Chuẩn bị payload để gửi lên server.
    // CHỈ gửi những thông tin cần thiết, không gửi giá. Server sẽ tự tính.
    const payload = {
      recipientName: form.name,
      recipientPhone: form.phone,
      recipientEmail: form.email,
      deliveryAddress: fullDeliveryAddress,
      deliveryMethod: form.delivery,
      paymentMethod: form.payment,
      note: form.note,
      voucherCode: appliedVoucher?.code || null,
      items: cartItems.map(item => ({
        product_id: item.id,
        variant_storage: item.storage, // Gửi thông tin để xác định biến thể
        quantity: item.quantity,
      }))
    };

    try {
      // Gọi API tạo đơn hàng mới
      const result = await orderAPI.createOrder(payload);

      // Dọn dẹp giỏ hàng ở client SAU KHI server xác nhận thành công
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage')); // Bắn sự kiện để các component khác cập nhật

      showSuccess(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${result.order_code}`, 'Thành công!');
      setSuccess(true);

    } catch (err) {
      // Hiển thị lỗi trả về từ server (ví dụ: lỗi validation)
      showError(err.message || 'Có lỗi không xác định xảy ra. Vui lòng thử lại!', 'Đặt hàng thất bại');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
         
          {/* Cột trái - Thông tin (Giữ nguyên JSX) */}
          <div className="w-full lg:flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaUser className="text-orange-500" /> Người đặt hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Họ và tên</label>
                  <input type="text" placeholder="Nhập họ và tên" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.name && <small className="text-red-500 mt-1 block">{errors.name}</small>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Số điện thoại</label>
                  <input type="tel" placeholder="Nhập số điện thoại" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.phone && <small className="text-red-500 mt-1 block">{errors.phone}</small>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Email (không bắt buộc)</label>
                  <input type="email" placeholder="Nhập email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.email && <small className="text-red-500 mt-1 block">{errors.email}</small>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaMapMarkerAlt className="text-orange-500" /> Hình thức nhận hàng</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button type="button" className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${form.delivery === 'Giao hàng tận nơi' ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold' : 'border-gray-300 text-gray-500 bg-gray-50 hover:border-gray-400'}`} onClick={() => setForm(f => ({...f, delivery: 'Giao hàng tận nơi'}))}><FaTruck /> Giao hàng tận nơi</button>
                <button type="button" className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${form.delivery === 'Nhận tại cửa hàng' ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold' : 'border-gray-300 text-gray-500 bg-gray-50 hover:border-gray-400'}`} onClick={() => setForm(f => ({...f, delivery: 'Nhận tại cửa hàng'}))}><FaStore /> Nhận tại cửa hàng</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Tỉnh/Thành, Quận/Huyện, Phường/Xã</label>
                  <input type="text" placeholder="VD: Hà Nội, Quận Ba Đình, Phường Cống Vị" value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.address && <small className="text-red-500 mt-1 block">{errors.address}</small>}
                </div>
                {form.delivery === 'Giao hàng tận nơi' && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Số nhà, tên đường</label>
                    <input type="text" placeholder="VD: 123 Đường Láng" value={form.addressDetail} onChange={e => setForm(f => ({...f, addressDetail: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                    {errors.addressDetail && <small className="text-red-500 mt-1 block">{errors.addressDetail}</small>}
                  </div>
                )}
                 <textarea placeholder="Ghi chú khác (không bắt buộc)" rows={2} value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
            </div>
           
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaCreditCard className="text-orange-500" /> Phương thức thanh toán</h2>
              <div className="space-y-3">
                {["Thanh toán khi nhận hàng (COD)", "Thanh toán qua VNPAY-QR", "Chuyển khoản ngân hàng"].map((method) => (
                  <label key={method} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${form.payment === method ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}`}>
                    <input type="radio" name="payment" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" checked={form.payment === method} onChange={() => setForm(f => ({...f, payment: method}))} />
                    <span className="ml-3 text-sm font-medium text-gray-700">{method}</span>
                  </label>
                ))}
                {errors.payment && <small className="text-red-500 mt-1 block">{errors.payment}</small>}
              </div>
            </div>
          </div>


          {/* Cột phải - Đơn hàng (Giữ nguyên JSX) */}
          <div className="w-full lg:w-96">
            <VoucherInput
              cartItems={cartItems}
              totalAmount={subtotal}
              onVoucherApplied={handleVoucherApplied}
              appliedVoucher={appliedVoucher}
              onVoucherRemoved={handleVoucherRemoved}
            />
           
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Đơn hàng của bạn ({cartItems.length})</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-lg bg-slate-100" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.storage}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-orange-600">{item.price.toLocaleString()}₫</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString()}₫</span></div>
                {form.delivery === 'Giao hàng tận nơi' && <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()}₫</span></div>}
                {voucherDiscount > 0 && <div className="flex justify-between"><span>Giảm giá voucher</span><span className="text-green-600">-{voucherDiscount.toLocaleString()}₫</span></div>}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{total.toLocaleString()}₫</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Đã bao gồm VAT (nếu có)</p>
              </div>
              <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50" onClick={handleOrder} disabled={loading || cartItems.length === 0 || success}>
                {loading ? 'Đang xử lý...' : (success ? 'Đã đặt hàng!' : 'Hoàn tất đặt hàng')}
              </button>
              {success && <div className="text-green-600 text-center mt-3 font-semibold">Cảm ơn bạn đã mua hàng!</div>}
              <p className="text-xs text-gray-500 mt-4 text-center">Bằng việc đặt hàng, bạn đồng ý với <Link to="/terms" className="text-blue-500 hover:underline">Điều khoản sử dụng</Link> của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;