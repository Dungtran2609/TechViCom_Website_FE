import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../../api';
import { useNotificationActions } from '../../components/notificationHooks';
import Toast from '../../components/Toast';

const mergeCarts = (userCart = [], guestCart = []) => {
  const combinedCart = [...userCart];
  guestCart.forEach(guestItem => {
    const existingItemIndex = combinedCart.findIndex(
      userItem => userItem.id === guestItem.id && userItem.variant?.storage === guestItem.variant?.storage
    );
    if (existingItemIndex > -1) {
      combinedCart[existingItemIndex].quantity += guestItem.quantity;
    } else {
      combinedCart.push(guestItem);
    }
  });
  return combinedCart;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotificationActions();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);



  // Thêm CSS cho hiệu ứng ảnh chuyển động
  const styles = `
    @keyframes scroll {
      from { transform: translateY(0); }
      to { transform: translateY(-50%); }
    }
    .scrolling-column {
      animation: scroll linear infinite;
    }
    .scrolling-column-1 { animation-duration: 20s; }
    .scrolling-column-2 { animation-duration: 25s; }
    .scrolling-column-3 { animation-duration: 18s; }
    .scroll-container-mask {
      mask-image: linear-gradient(to bottom, transparent, white 10%, white 90%, transparent);
      -webkit-mask-image: linear-gradient(to bottom, transparent, white 10%, white 90%, transparent);
    }
  `;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone.trim() || !form.password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      showError('Vui lòng nhập đầy đủ thông tin!', 'Thông tin không đầy đủ');
      return;
    }
    setLoading(true);
    try {
      const userData = await userAPI.login(form.phone, form.password);
      const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
      let finalUserData = userData;

      if (guestCart.length > 0) {
        const mergedCart = mergeCarts(userData.cart, guestCart);
        finalUserData = await userAPI.updateUser(userData.id, { cart: mergedCart });
      }

      localStorage.setItem('user', JSON.stringify(finalUserData));
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('userChanged'));

      // Show success notification with user name
      const userName = finalUserData.name || finalUserData.phone || 'Người dùng';
      success(`Chào mừng bạn trở lại, ${userName}! Đăng nhập thành công.`, 'Đăng nhập thành công');

      if (localStorage.getItem('firstLogin') === 'true') {
        localStorage.removeItem('firstLogin');
        navigate('/update-profile');
      } else {
        navigate('/');
      }
    } catch {
      setError('Lỗi kết nối tới server!');
      showError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.', 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng cùng bộ ảnh với trang Register để nhất quán
  const imagesCol1 = ['/images/logo/phone.png', '/images/logo/laptop.png', '/images/logo/bill.png'];
  const imagesCol2 = ['/images/logo/air-conditioner.png', '/images/logo/service.png', '/images/logo/shipped.png'];
  const imagesCol3 = ['/images/logo/laptop.png', '/images/logo/phone.png', '/images/logo/service.png'];

  return (
    <>
      <style>{styles}</style>
      {/* Thêm pt-28 để tạo khoảng cách với Header */}
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-hidden pt-28">
        <div className="w-full h-full flex flex-row items-stretch">
          
          {/* PHẦN HIỂN THỊ ẢNH ĐỘNG */}
          <div className="hidden md:flex w-1/2 lg:w-3/5 h-screen items-center justify-center p-8 relative overflow-hidden">
            <div className="flex justify-center gap-6 h-full scroll-container-mask">
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-1">
                {[...imagesCol1, ...imagesCol1].map((src, index) => (
                  <img key={`col1-${index}`} src={src} alt="Dịch vụ Techvicom" className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300" />
                ))}
              </div>
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-2" style={{ animationDirection: 'reverse' }}>
                {[...imagesCol2, ...imagesCol2].map((src, index) => (
                  <img key={`col2-${index}`} src={src} alt="Sản phẩm Techvicom" className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300" />
                ))}
              </div>
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-3">
                 {[...imagesCol3, ...imagesCol3].map((src, index) => (
                  <img key={`col3-${index}`} src={src} alt="Ưu đãi Techvicom" className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300" />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-transparent to-white/50"></div>
          </div>
          
          {/* FORM ĐĂNG NHẬP */}
          <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <img src="/images/logo/logon.jpg" alt="Techvicom ID" className="h-8" />
                        <span className="text-2xl font-bold text-gray-400">⇆</span>
                        <img src="/images/logo/logon.jpg" alt="Techvicom Play" className="h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Đăng nhập Techvicom</h2>
                    <p className="text-gray-500 text-sm mt-1">Mua sắm và trải nghiệm dịch vụ</p>
                </div>
                <form className="w-full space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Số điện thoại</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" autoComplete="username" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Mật khẩu</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Nhập mật khẩu" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" autoComplete="current-password" />
                  </div>
                  {error && (
                    <Toast message={error} type="error" onClose={() => setError("")} duration={2200} />
                  )}
                  <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
                  <div className="text-xs text-gray-500 text-center mt-2 px-4">
                    Khi đăng nhập, bạn đồng ý với <a href="#" className="text-orange-500 underline">Điều khoản</a> và <a href="#" className="text-orange-500 underline">Chính sách</a> của chúng tôi.
                  </div>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-orange-500 font-semibold hover:underline">Đăng ký ngay</Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;