import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../../api';
import Toast from '../../components/Toast';
import { useNotificationActions } from '../../components/notificationHooks';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotificationActions();
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.phone.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      showError('Vui lòng nhập đầy đủ thông tin!', 'Thông tin không đầy đủ');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      showError('Mật khẩu nhập lại không khớp!', 'Lỗi xác nhận mật khẩu');
      return;
    }

    const phoneRegex = /^[0-9]{9,15}$/;
    if (!phoneRegex.test(form.phone.trim())) {
      setError('Số điện thoại không hợp lệ!');
      showError('Vui lòng nhập số điện thoại hợp lệ.', 'Lỗi định dạng');
      return;
    }

    setLoading(true);

    try {
      // Nếu backend có API check số điện thoại tồn tại thì nên dùng, hoặc bỏ phần này
      const allUsers = await userAPI.getAllUsers?.(); 
      if (allUsers && allUsers.some(user => user.phone === form.phone.trim())) {
        setError('Số điện thoại đã được đăng ký!');
        showError('Số điện thoại đã được đăng ký! Vui lòng sử dụng số khác.', 'Đăng ký thất bại');
        setLoading(false);
        return;
      }

      const userData = { 
        name: form.name.trim(), 
        phone: form.phone.trim(), 
        password: form.password, 
        email: form.email.trim() || null, 
        avatar: '/images/avatar-default.png',
      };

      const user = await userAPI.register(
        userData.name,
        userData.email,
        userData.password,
        form.confirmPassword // truyền confirm password nếu backend yêu cầu
      );

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('success', 'Đăng ký thành công!');
      localStorage.setItem('firstLogin', 'true');

      success(`Chào mừng ${form.name.trim()}! Tài khoản đã được tạo thành công.`, 'Đăng ký thành công');
      setLoading(false);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err.message || 'Lỗi kết nối tới server!';
      setError(msg);
      showError(msg, 'Lỗi kết nối');
      setLoading(false);
    }
  };

  const imagesCol1 = ['/images/logo/phone.png', '/images/logo/laptop.png', '/images/logo/bill.png'];
  const imagesCol2 = ['/images/logo/air-conditioner.png', '/images/logo/service.png', '/images/logo/shipped.png'];
  const imagesCol3 = ['/images/logo/laptop.png', '/images/logo/phone.png', '/images/logo/service.png'];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-hidden pt-28">
        <div className="w-full h-full flex flex-row items-stretch">
          <div className="hidden md:flex w-1/2 lg:w-3/5 h-screen items-center justify-center p-8 relative overflow-hidden">
            <div className="flex justify-center gap-6 h-full scroll-container-mask">
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-1">
                {[...imagesCol1, ...imagesCol1].map((src, index) => (
                  <img
                    key={`col1-${index}`}
                    src={src}
                    alt="Dịch vụ Techvicom"
                    className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-2" style={{ animationDirection: 'reverse' }}>
                {[...imagesCol2, ...imagesCol2].map((src, index) => (
                  <img
                    key={`col2-${index}`}
                    src={src}
                    alt="Sản phẩm Techvicom"
                    className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
              <div className="w-1/3 space-y-6 scrolling-column scrolling-column-3">
                {[...imagesCol3, ...imagesCol3].map((src, index) => (
                  <img
                    key={`col3-${index}`}
                    src={src}
                    alt="Ưu đãi Techvicom"
                    className="rounded-2xl w-full h-auto object-cover shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 via-transparent to-white/50"></div>
          </div>

          <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-sm">
              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <img src="/images/logo/logon.jpg" alt="Techvicom ID" className="h-8" />
                  <span className="text-2xl font-bold text-gray-400">⇆</span>
                  <img src="/images/logo/logon.jpg" alt="Techvicom Play" className="h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tạo tài khoản Techvicom</h2>
                <p className="text-gray-500 text-sm mt-1">Trải nghiệm hệ sinh thái của chúng tôi</p>
              </div>
              <form className="w-full space-y-4" onSubmit={handleRegister} autoComplete="off">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Email (không bắt buộc)</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    autoComplete="new-password"
                  />
                </div>
                {error && <Toast message={error} type="error" onClose={() => setError('')} duration={2200} />}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                >
                  {loading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
                <div className="text-xs text-gray-500 text-center mt-2 px-4">
                  Khi đăng ký, bạn đồng ý với{' '}
                  <a href="#" className="text-orange-500 underline">
                    Điều khoản
                  </a>{' '}
                  và{' '}
                  <a href="#" className="text-orange-500 underline">
                    Chính sách
                  </a>{' '}
                  của chúng tôi.
                </div>
              </form>
              <div className="mt-6 text-center text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-orange-500 font-semibold hover:underline">
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
