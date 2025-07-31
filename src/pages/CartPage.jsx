import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, productAPI } from '../api/api.js';

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

export default function CartPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  
  // ==========================================================
  // SỬA LỖI Ở ĐÂY: Chặn truy cập nếu chưa đăng nhập
  // ==========================================================
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // Nếu không có user, chuyển hướng về trang đăng nhập
      // Có thể lưu lại trang hiện tại để quay lại sau khi đăng nhập thành công
      navigate('/login', { state: { from: '/cart' } });
    } else {
      setCurrentUser(user);
      setCart(user.cart || []);
    }
  }, []); // Loại bỏ navigate khỏi dependency array

  useEffect(() => {
    // Chỉ fetch products nếu đã đăng nhập
    if (currentUser) {
      productAPI.getProducts()
        .then(data => setProducts(data))
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [currentUser]);

  const updateUserCart = async (newCart) => {
    if (!currentUser) return;
    try {
      const updatedUser = await userAPI.updateUser(currentUser.id, { cart: newCart });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCart(newCart);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng:", error);
    }
  };

  const cartDetails = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    const variant = product?.variants?.find(v => v.storage === item.variant?.storage);
    return { ...item, product, variant };
  }).filter(item => item.product);

  const total = cartDetails.reduce((sum, item) => sum + (item.variant?.price || item.product?.price || 0) * item.quantity, 0);
  const totalOriginal = cartDetails.reduce((sum, item) => sum + (item.product?.originalPrice || item.product?.price || 0) * item.quantity, 0);
  const totalSave = totalOriginal - total;

  const updateQuantity = async (id, variant, delta) => {
    const newCart = cart.map(item => {
      if (item.id === id && item.variant?.storage === variant?.storage) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    await updateUserCart(newCart);
  };

  const removeItem = async (id, variant) => {
    const newCart = cart.filter(item => !(item.id === id && item.variant?.storage === variant?.storage));
    await updateUserCart(newCart);
  };
  
  // Nếu chưa có user, hiển thị màn hình loading để tránh flash nội dung
  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen pt-24 pb-10 px-2 flex items-center justify-center">
        Đang chuyển hướng đến trang đăng nhập...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-10 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Giỏ hàng của bạn</h1>
        {cartDetails.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500 text-lg">
            Giỏ hàng của bạn đang trống.<br />
            <Link to="/" className="text-orange-500 font-semibold hover:underline">Quay lại mua sắm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartDetails.map((item, idx) => (
                <div key={idx} className="flex items-center bg-white rounded-xl shadow p-4 gap-4 relative group hover:shadow-2xl transition-shadow">
                  <img src={item.product?.image} alt={item.product?.name} className="w-20 h-20 object-contain rounded-lg bg-gray-100" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base text-gray-900 truncate">{item.product?.name}</div>
                    {item.variant && (
                      <div className="text-xs text-gray-500">Dung lượng: {item.variant.storage}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-bold text-red-600">{item.variant ? item.variant.price.toLocaleString() : item.product?.price.toLocaleString()}₫</span>
                      <span className="text-xs line-through text-gray-400">{item.product?.originalPrice.toLocaleString()}₫</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center border rounded-lg overflow-hidden h-10">
                      <button
                        className="w-8 h-10 flex items-center justify-center text-lg text-gray-500 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.variant, -1)}
                      >-</button>
                      <span className="w-10 h-10 flex items-center justify-center text-base font-semibold">{item.quantity}</span>
                      <button
                        className="w-8 h-10 flex items-center justify-center text-lg text-gray-500 hover:bg-gray-100"
                        onClick={() => updateQuantity(item.id, item.variant, 1)}
                      >+</button>
                    </div>
                    <button className="text-xs text-red-500 hover:underline" onClick={() => removeItem(item.id, item.variant)}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-28">
              <h2 className="font-semibold text-gray-800 text-lg mb-4">Thông tin đơn hàng</h2>
              <div className="flex justify-between text-sm mb-2">
                <span>Tạm tính</span>
                <span>{totalOriginal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tiết kiệm</span>
                <span className="text-green-600">{totalSave > 0 ? totalSave.toLocaleString() : 0}₫</span>
              </div>
              <div className="flex justify-between text-base font-semibold mb-2">
                <span>Thành tiền</span>
                <span className="text-orange-600">{total.toLocaleString()}₫</span>
              </div>
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-4 text-lg shadow"
                onClick={() => navigate('/checkout')}
              >Tiến hành đặt hàng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}