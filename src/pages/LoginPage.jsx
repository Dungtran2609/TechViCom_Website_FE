import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/services/authService';
import { setAuthToken } from '../api/config';
import { useNotifications } from '../components/NotificationSystem';
import Toast from '../components/Toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotifications();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = `...`; // giữ nguyên phần animation như bạn đã viết

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      showError('Vui lòng nhập đầy đủ thông tin!', 'Thông tin không đầy đủ');
      return;
    }

    setLoading(true);
    try {
      const res = await login(form); // { email, password }
      const token = res.access_token;
      const user = res.user;

      // Lưu token
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('userChanged'));

      success(`Chào mừng ${user.name || user.email}!`, 'Đăng nhập thành công');
      navigate('/');
    } catch (err) {
      setError('Sai tài khoản hoặc mật khẩu!');
      showError('Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.', 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white overflow-hidden pt-28">
        <div className="w-full h-full flex flex-row items-stretch">

          {/* PHẦN HIỂN THỊ ẢNH ĐỘNG */}
          <div className="hidden md:flex w-1/2 lg:w-3/5 h-screen items-center justify-center p-8 relative overflow-hidden">
            {/* giữ nguyên phần image column */}
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
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                    autoComplete="username"
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
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <Toast message={error} type="error" onClose={() => setError('')} duration={2200} />
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-3 rounded-lg text-lg shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
                <div className="text-xs text-gray-500 text-center mt-2 px-4">
                  Khi đăng nhập, bạn đồng ý với{' '}
                  <a href="#" className="text-orange-500 underline">Điều khoản</a> và{' '}
                  <a href="#" className="text-orange-500 underline">Chính sách</a> của chúng tôi.
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
