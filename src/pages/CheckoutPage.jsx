import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaTruck, FaStore, FaCreditCard } from 'react-icons/fa';
import VoucherInput from '../components/VoucherInput';
import { voucherAPI, productAPI, userAPI } from '../api/api.js';
import { useNotificationActions } from '../components/notificationHooks';

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

  useEffect(() => {
    productAPI.getProducts()
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

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

  useEffect(() => {
    if (!products.length) return;
    
    const buyNowId = query.get('buyNow');
    const buyNowStorage = query.get('storage');
    if (buyNowId) {
      const product = products.find(p => String(p.id) === String(buyNowId));
      let variant = product?.variants?.find(v => v.storage === buyNowStorage);
      setCartItems(product ? [{ ...product, price: variant?.price || product.price || 0, storage: variant?.storage || buyNowStorage || '', quantity: 1 }] : []);
    } else {
      const currentUser = getCurrentUser();
      let cart = currentUser?.cart || JSON.parse(localStorage.getItem('cart') || '[]');
      const mapped = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const variant = product?.variants?.find(v => v.storage === item.variant?.storage);
        return { ...item, ...product, price: variant?.price || product?.price || 0, storage: variant?.storage || item.variant?.storage || '' };
      }).filter(item => item.name);
      setCartItems(mapped);
    }
  }, [products, query]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/thankyou', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginal = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
  const totalSave = totalOriginal - subtotal;
  
  // Tính phí vận chuyển
  const shippingFee = form.delivery === 'Giao hàng tận nơi' ? 30000 : 0;
  
  // Tính giảm giá từ voucher
  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  
  // Tính tổng tiền cuối cùng
  const total = subtotal + shippingFee - voucherDiscount;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!/^\d{9,11}$/.test(form.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'Email không hợp lệ';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (form.delivery === 'Giao hàng tận nơi' && !form.addressDetail.trim()) newErrors.addressDetail = 'Vui lòng nhập địa chỉ chi tiết';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    return newErrors;
  };

  const handleVoucherApplied = (voucher) => {
    setAppliedVoucher(voucher);
    showSuccess(`Đã áp dụng voucher ${voucher.code}! Giảm ${voucher.discountAmount.toLocaleString()}đ`, 'Áp dụng voucher thành công');
  };

  const handleVoucherRemoved = () => {
    setAppliedVoucher(null);
    showSuccess('Đã hủy áp dụng voucher!', 'Hủy voucher thành công');
  };

  const handleOrder = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    try {
      const user = getCurrentUser();
      if (!user?.id) {
        showError('Bạn cần đăng nhập để đặt hàng!', 'Đặt hàng thất bại');
        setLoading(false);
        return;
      }

      // Cập nhật số lượt sử dụng voucher nếu có
      if (appliedVoucher) {
        // Note: updateVoucherUsage method not available in new API
        // await voucherAPI.updateVoucherUsage(appliedVoucher.id, appliedVoucher.usedCount);
      }

      const newOrder = {
        orderId: 'DH' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleDateString('vi-VN'),
        subtotal,
        shippingFee,
        voucherDiscount,
        total,
        voucherCode: appliedVoucher?.code || null,
        status: 'Đang xử lý',
        products: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
      };
      const updatedOrders = [...(user.orders || []), newOrder];
      const updatedUser = await userAPI.updateUser(user.id, { orders: updatedOrders, cart: [] });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
      
      // Hiển thị thông báo đặt hàng thành công
      showSuccess(`Đặt hàng thành công! Mã đơn hàng: ${newOrder.orderId}`, 'Đặt hàng thành công');
      
      setSuccess(true);
    } catch (err) {
      showError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!', 'Đặt hàng thất bại');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Cột trái - Thông tin */}
          <div className="w-full lg:flex-1 space-y-6">
            {/* Người đặt hàng */}
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

            {/* Hình thức nhận hàng */}
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
                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" checked={form.invoice} onChange={e => setForm(f => ({...f, invoice: e.target.checked}))} />Xuất hóa đơn công ty</label>
                  <label className="flex items-center gap-2 text-gray-600"><input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" checked={form.confirmCall} onChange={e => setForm(f => ({...f, confirmCall: e.target.checked}))} />Gọi xác nhận trước khi giao</label>
                </div>
              </div>
            </div>
            
            {/* Phương thức thanh toán */}
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

          {/* Cột phải - Đơn hàng */}
          <div className="w-full lg:w-96">
            {/* Voucher Input */}
            <VoucherInput
              cartItems={cartItems}
              totalAmount={subtotal}
              onVoucherApplied={handleVoucherApplied}
              appliedVoucher={appliedVoucher}
              onVoucherRemoved={handleVoucherRemoved}
            />
            
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
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
                <div className="flex justify-between"><span>Tiết kiệm</span><span className="text-green-600">{totalSave > 0 ? `-${totalSave.toLocaleString()}` : 0}₫</span></div>
                {form.delivery === 'Giao hàng tận nơi' && (
                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee.toLocaleString()}₫</span>
                  </div>
                )}
                {voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>Giảm giá voucher</span>
                    <span className="text-green-600">-{voucherDiscount.toLocaleString()}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">{total.toLocaleString()}₫</span>
                </div>
                <p className="text-xs text-gray-500 text-right">Đã bao gồm VAT (nếu có)</p>
              </div>
              <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50" onClick={handleOrder} disabled={loading || cartItems.length === 0 || success}>
                {loading ? 'Đang xử lý...' : (success ? 'Đã đặt hàng' : 'Hoàn tất đặt hàng')}
              </button>
              {success && <div className="text-green-600 text-center mt-3 font-semibold">Đặt hàng thành công! Đang chuyển hướng...</div>}
              <p className="text-xs text-gray-500 mt-4 text-center">Bằng việc đặt hàng, bạn đồng ý với <Link to="/terms" className="text-blue-500 hover:underline">Điều khoản sử dụng</Link> của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;