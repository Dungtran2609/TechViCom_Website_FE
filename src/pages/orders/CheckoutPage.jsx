import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaTruck, FaStore, FaCreditCard } from 'react-icons/fa';
import VoucherInput from '../../components/VoucherInput';
import { productAPI } from '../../api';
import { orderAPI } from '../../api/modules/orderAPI';
import { useNotificationActions } from '../../components/notificationHooks';

// Helper function để lấy query params từ URL
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// Helper function để lấy thông tin người dùng từ localStorage
function getCurrentUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
}

const CheckoutPage = () => {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm
  const [cartItems, setCartItems] = useState([]); // Các sản phẩm trong giỏ hàng để thanh toán
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', addressDetail: '',
    note: '', delivery: 'Giao hàng tận nơi', payment: '',
  });
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true); // Cờ kiểm tra dữ liệu đang tải
  const [loading, setLoading] = useState(false); // Trạng thái loading cho nút đặt hàng
  const [success, setSuccess] = useState(false); // Trạng thái đặt hàng thành công

  const navigate = useNavigate();
  const query = useQuery();
  const { success: showSuccess, error: showError } = useNotificationActions();

  // --- LUỒNG XỬ LÝ DỮ LIỆU ---

  // BƯỚC 1: Tải danh sách sản phẩm TỪ API.
  useEffect(() => {
    productAPI.getProducts()
      .then(response => {
        // ✅ SỬA LỖI QUAN TRỌNG TẠI ĐÂY
        // API trả về một object { data: [...] }, chúng ta cần lấy mảng `data` bên trong.
        // Thêm `|| []` để phòng trường hợp `response.data` không tồn tại, `products` sẽ là mảng rỗng và không gây crash.
        setProducts(response.data || []);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        showError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại!', 'Lỗi dữ liệu');
      })
      .finally(() => {
        setIsDataLoading(false); // Báo hiệu rằng việc tải dữ liệu đã hoàn tất
      });
  }, [showError]);

  // BƯỚC 2: Xây dựng giỏ hàng SAU KHI đã có dữ liệu sản phẩm.
  useEffect(() => {
    if (isDataLoading) return; // Nếu đang tải thì không làm gì cả

    const buyNowId = query.get('buyNow');
    const buyNowStorage = query.get('storage');
    let finalCartItems = [];

    if (buyNowId) {
      const product = products.find(p => String(p.id) === String(buyNowId));
      if (product) {
        let selectedVariant = (product.variants && product.variants.length > 0)
          ? (buyNowStorage ? product.variants.find(v => v.storage === buyNowStorage) : product.variants[0])
          : null;

        finalCartItems = [{
          ...product,
          price: selectedVariant?.price ?? product.price ?? 0,
          storage: selectedVariant?.storage ?? '',
          variant_id: selectedVariant?.id ?? null,
          quantity: 1,
        }];
      }
    } else {
      const cartFromStorage = JSON.parse(localStorage.getItem('cart') || '[]');
      finalCartItems = cartFromStorage.map(item => {
        const product = products.find(p => String(p.id) === String(item.id));
        if (!product) return null;
        const variant = product.variants?.find(v => v.storage === item.variant?.storage);
        return { ...item, ...product, price: variant?.price ?? product.price ?? 0, storage: variant?.storage || '', variant_id: variant?.id };
      }).filter(Boolean);
    }

    setCartItems(finalCartItems);

  }, [isDataLoading, products, query]);

  // Điền thông tin người dùng
  useEffect(() => {
    const user = getCurrentUser();
    if (user) setForm(f => ({ ...f, name: user.name || '', phone: user.phone || '', email: user.email || '', address: user.addresses?.find(a => a.isDefault)?.address || '' }));
  }, []);

  // Chuyển hướng
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/orders', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // --- LOGIC TÍNH TOÁN VÀ SỰ KIỆN ---
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cartItems]);
  const shippingFee = form.delivery === 'Giao hàng tận nơi' ? 30000 : 0;
  const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
  const total = useMemo(() => subtotal + shippingFee - voucherDiscount, [subtotal, shippingFee, voucherDiscount]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Vui lòng nhập họ tên';
    if (!/^\d{9,11}$/.test(form.phone.trim())) newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!form.payment) newErrors.payment = 'Vui lòng chọn phương thức thanh toán';
    if (!form.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) {
      showError('Vui lòng kiểm tra lại thông tin đơn hàng!', 'Lỗi nhập liệu');
      return;
    }
    setLoading(true);
    const payload = {
      recipient_name: form.name, recipient_phone: form.phone,
      recipient_address: form.delivery === 'Giao hàng tận nơi' ? `${form.addressDetail}, ${form.address}`.replace(/^,\s*|,$/g, '') : "Nhận tại cửa hàng",
      shipping_method_id: form.delivery === 'Giao hàng tận nơi' ? 1 : 2,
      payment_method: { "Thanh toán khi nhận hàng (COD)": "cod", "Thanh toán qua VNPAY-QR": "vnpay", "Chuyển khoản ngân hàng": "bank_transfer" }[form.payment],
      note: form.note, coupon_code: appliedVoucher?.code || null,
      order_items: cartItems.map(item => ({ product_id: item.id, variant_id: item.variant_id, quantity: item.quantity })),
    };

    try {
      const result = await orderAPI.createOrder(payload);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('storage'));
      showSuccess(`Đặt hàng thành công! Mã đơn hàng: #${result.data?.id || 'mới'}`, 'Thành công!');
      setSuccess(true);
    } catch (err) {
      showError(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng.', 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER COMPONENT ---
  if (isDataLoading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cột trái */}
          <div className="w-full lg:flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaUser className="text-orange-500" /> Người đặt hàng</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Họ và tên</label>
                  <input type="text" placeholder="Nhập họ và tên" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.name && <small className="text-red-500 mt-1 block">{errors.name}</small>}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Số điện thoại</label>
                  <input type="tel" placeholder="Nhập số điện thoại" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.phone && <small className="text-red-500 mt-1 block">{errors.phone}</small>}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaMapMarkerAlt className="text-orange-500" /> Hình thức nhận hàng</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button type="button" className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${form.delivery === 'Giao hàng tận nơi' ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold' : 'border-gray-300 text-gray-500 bg-gray-50 hover:border-gray-400'}`} onClick={() => setForm(f => ({ ...f, delivery: 'Giao hàng tận nơi' }))}><FaTruck /> Giao hàng tận nơi</button>
                <button type="button" className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-all ${form.delivery === 'Nhận tại cửa hàng' ? 'border-orange-500 bg-orange-50 text-orange-600 font-semibold' : 'border-gray-300 text-gray-500 bg-gray-50 hover:border-gray-400'}`} onClick={() => setForm(f => ({ ...f, delivery: 'Nhận tại cửa hàng' }))}><FaStore /> Nhận tại cửa hàng</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-1 block">Tỉnh/Thành, Quận/Huyện, Phường/Xã</label>
                  <input type="text" placeholder="VD: Hà Nội, Quận Ba Đình, Phường Cống Vị" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  {errors.address && <small className="text-red-500 mt-1 block">{errors.address}</small>}
                </div>
                {form.delivery === 'Giao hàng tận nơi' && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">Số nhà, tên đường</label>
                    <input type="text" placeholder="VD: 123 Đường Láng" value={form.addressDetail} onChange={e => setForm(f => ({ ...f, addressDetail: e.target.value }))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                  </div>
                )}
                <textarea placeholder="Ghi chú khác (không bắt buộc)" rows={2} value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3"><FaCreditCard className="text-orange-500" /> Phương thức thanh toán</h2>
              <div className="space-y-3">
                {["Thanh toán khi nhận hàng (COD)", "Thanh toán qua VNPAY-QR", "Chuyển khoản ngân hàng"].map((method) => (
                  <label key={method} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${form.payment === method ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'}`}>
                    <input type="radio" name="payment" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" checked={form.payment === method} onChange={() => setForm(f => ({ ...f, payment: method }))} />
                    <span className="ml-3 text-sm font-medium text-gray-700">{method}</span>
                  </label>
                ))}
                {errors.payment && <small className="text-red-500 mt-1 block">{errors.payment}</small>}
              </div>
            </div>
          </div>
          {/* Cột phải */}
          <div className="w-full lg:w-96">
            <VoucherInput cartItems={cartItems} totalAmount={subtotal} onVoucherApplied={(v) => setAppliedVoucher(v)} appliedVoucher={appliedVoucher} onVoucherRemoved={() => setAppliedVoucher(null)} />
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24 mt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">Đơn hàng của bạn ({cartItems.length})</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 mb-4">
                {cartItems.length > 0 ? cartItems.map((item, idx) => (
                  <div key={`${item.id}-${item.variant_id || idx}`} className="flex items-start gap-4">
                    <img src={item.image || item.thumbnail} alt={item.name} className="w-16 h-16 object-contain rounded-lg bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-800 leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.storage}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-sm text-orange-600">{item.price.toLocaleString()}₫</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                  </div>
                )) : <p className="text-center text-gray-500 py-4">Giỏ hàng của bạn đang trống.</p>}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Tạm tính</span><span>{subtotal.toLocaleString()}₫</span></div>
                {form.delivery === 'Giao hàng tận nơi' && <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shippingFee.toLocaleString()}₫</span></div>}
                {voucherDiscount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá voucher</span><span>-{voucherDiscount.toLocaleString()}₫</span></div>}
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Tổng cộng</span><span className="text-red-600">{total.toLocaleString()}₫</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleOrder} disabled={loading || cartItems.length === 0 || success}>
                {loading ? 'Đang xử lý...' : (success ? 'Đã đặt hàng!' : 'Hoàn tất đặt hàng')}
              </button>
              {success && <div className="text-green-600 text-center mt-3 font-semibold">Cảm ơn bạn! Đang chuyển hướng...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;