import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Background hình ảnh bên trái */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 h-full p-8 gap-4">
        <div className="grid grid-cols-3 gap-4">
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/1.png" alt="FPT Education" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/2.png" alt="FPT Play" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/3.png" alt="Fshare" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/4.png" alt="FPT Camera" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/5.png" alt="FPT Play" className="rounded-2xl w-40 h-40 object-cover" />
          <img src="https://fptshop.com.vn/uploads/images/2023/Thang10/desktop/6.png" alt="FPT Long Châu" className="rounded-2xl w-40 h-40 object-cover" />
        </div>
      </div>
      {/* Form đăng nhập */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-16 py-12 bg-white bg-opacity-80 rounded-2xl shadow-xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img src="https://id.fpt.vn/images/logo-fpt-id.svg" alt="Techvicom ID" className="h-8" />
            <span className="text-2xl font-bold">⇆</span>
            <img src="https://id.fpt.vn/images/logo-fpt-play.svg" alt="FPT Play" className="h-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Tài khoản sử dụng mọi dịch vụ <span className="inline-block">🎉🎉</span></h2>
        </div>
        <form className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Nhập số điện thoại" className="w-full border border-orange-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-2 rounded-lg text-lg shadow hover:from-orange-500 hover:to-orange-600 transition">Tiếp tục</button>
          <div className="text-xs text-gray-500 text-center mt-2">
            Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="text-orange-500 underline">Điều khoản</a> và <a href="#" className="text-orange-500 underline">Chính sách bảo mật</a> của Techvicom ID
          </div>
        </form>
        <div className="flex flex-col items-center mt-8 w-full">
          <div className="text-gray-500 mb-2">Hoặc đăng nhập bằng</div>
          <div className="flex gap-4 justify-center">
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-orange-500 text-xl"><i className="fas fa-qrcode"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-orange-500 text-xl"><i className="fas fa-fingerprint"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-gray-700 text-xl"><i className="fab fa-apple"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-gray-700 text-xl"><i className="fab fa-google"></i></button>
            <button className="bg-orange-50 hover:bg-orange-100 p-3 rounded-full shadow text-blue-600 text-xl"><i className="fab fa-facebook-f"></i></button>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          Bạn chưa có tài khoản?{' '}
          <a href="/register" className="text-orange-500 font-semibold hover:underline">Đăng ký</a>
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

export default LoginPage; 