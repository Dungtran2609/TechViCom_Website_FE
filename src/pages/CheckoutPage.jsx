import React, { useEffect, useState } from "react";
import { products } from '../data/products';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
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
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Họ và tên" />
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Số điện thoại" />
              <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Email (không bắt buộc)" />
            </div>
          </div>

          {/* Hình thức nhận hàng */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Hình thức nhận hàng</h2>
            <div className="flex gap-4 mb-4">
              <button className="flex-1 border border-blue-500 text-blue-500 rounded px-4 py-2 font-medium text-sm bg-blue-50">Giao hàng tận nơi</button>
              <button className="flex-1 border border-gray-300 text-gray-500 rounded px-4 py-2 font-medium text-sm">Nhận tại cửa hàng</button>
            </div>
            <input className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Tỉnh/Thành phố, Quận/Huyện, Phường/Xã" />
            <input className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Địa chỉ nhận hàng (số nhà, tên đường, tên khu vực)" />
            <textarea className="w-full border rounded px-3 py-2 text-sm mb-2" placeholder="Ghi chú khác (không bắt buộc khi nhận hàng)" rows={2} maxLength={170}></textarea>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Xuất hóa đơn điện tử
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Gọi xác nhận trước khi giao hàng
              </label>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-red-500" />
                Thanh toán khi nhận hàng
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-blue-500" />
                Thanh toán quét QR code, ví VNPAY, ZaloPay, Momo, ShopeePay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-green-500" />
                Thanh toán qua thẻ ATM nội địa/Internet Banking
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-yellow-500" />
                Thanh toán qua thẻ quốc tế Visa, Master, JCB, AMEX, Apple Pay, Google Pay, Samsung Pay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-pink-500" />
                Thanh toán qua thẻ tín dụng/trả góp qua thẻ tín dụng
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-purple-500" />
                Thanh toán qua thẻ ATM trả góp qua thẻ nội địa
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-indigo-500" />
                Thanh toán qua ví Moca/Grab
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-blue-400" />
                Thanh toán qua ví ZaloPay
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" className="accent-red-400" />
                Thanh toán qua ví ShopeePay
              </label>
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
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded text-base">Đặt hàng</button>
            <div className="text-xs text-gray-500 mt-3 text-center">Bằng việc đặt hàng, bạn đồng ý với <span className="text-blue-500 underline cursor-pointer">Điều khoản sử dụng</span> và <span className="text-blue-500 underline cursor-pointer">Chính sách bảo mật</span> của chúng tôi.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
