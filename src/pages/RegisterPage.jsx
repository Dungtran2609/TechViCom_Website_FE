import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import Toast from '../components/Toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '', confirmPassword: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }
    setLoading(true);
    try {
      // Kiểm tra trùng số điện thoại trên đúng port 3002
      const checkRes = await fetch(`http://localhost:3002/users?phone=${encodeURIComponent(form.phone)}`);
      const existed = await checkRes.json();
      console.log('Kết quả kiểm tra số điện thoại:', existed); // debug
      if (Array.isArray(existed) && existed.length > 0) {
        setError('Số điện thoại đã được đăng ký!');
        setLoading(false);
        return;
      }
      // Gọi API đăng ký user
      const user = await registerUser({ phone: form.phone, password: form.password, email: form.email });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('success', 'Đăng ký thành công!');
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError('Lỗi kết nối tới server!');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Background hình ảnh bên trái */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 h-full p-8 gap-4">
        <div className="grid grid-cols-3 gap-4">
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/1.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/2.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/3.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/4.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/5.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://techvicomshop.com.vn/uploads/images/2023/Thang10/desktop/6.png" alt="Techvicom" className="rounded-2xl w-40 h-40 object-cover" />
        </div>
      </div>
      {/* Form đăng ký */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-16 py-12 bg-white bg-opacity-80 rounded-2xl shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img src="https://id.techvicom.vn/images/logo-techvicom-id.svg" alt="Techvicom ID" className="h-8" />
            <span className="text-2xl font-bold">⇆</span>
            <img src="https://id.techvicom.vn/images/logo-techvicom-play.svg" alt="Techvicom Play" className="h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Đăng ký tài khoản</h2>
        </div>
        <form className="w-full max-w-sm space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" className="w-full border border-orange-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email (không bắt buộc)</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Nhập email" className="w-full border border-orange-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mật khẩu</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Nhập mật khẩu" className="w-full border border-orange-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nhập lại mật khẩu</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu" className="w-full border border-orange-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          {error && (
            <Toast message={error} type="error" onClose={() => setError("")} duration={2200} />
          )}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-2 rounded-lg text-lg shadow hover:from-orange-500 hover:to-orange-600 transition">{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
          <div className="text-xs text-gray-500 text-center mt-2">
            Khi đăng ký, bạn đồng ý với <a href="#" className="text-orange-500 underline">Điều khoản</a> và <a href="#" className="text-orange-500 underline">Chính sách bảo mật</a> của Techvicom ID
          </div>
        </form>
        <div className="flex flex-col items-center mt-8 w-full">
          <div className="text-gray-500 mb-2">Hoặc đăng ký bằng</div>
          <div className="flex gap-4 justify-center">
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-orange-500 text-xl"><i className="fas fa-qrcode"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-orange-500 text-xl"><i className="fas fa-fingerprint"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-gray-700 text-xl"><i className="fab fa-apple"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-gray-700 text-xl"><i className="fab fa-google"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-blue-600 text-xl"><i className="fab fa-facebook-f"></i></button>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">Đăng nhập</Link>
        </div>
      </div>
      {/* Họa tiết nền */}
      <div className="absolute right-0 bottom-0 w-1/2 h-1/2 z-0">
        <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="50" y="50" width="300" height="300" rx="60" stroke="#FFB86C" strokeWidth="3" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default RegisterPage; 