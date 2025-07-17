import React from 'react';
import { Link } from 'react-router-dom';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 pb-10 px-2">
      <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-700 mb-6 text-center">Cảm ơn bạn đã mua hàng tại TechViCom.<br />Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.</p>
        <Link to="/" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded text-base shadow-lg transition mb-2">Về trang chủ</Link>
        <Link to="/products" className="text-orange-500 hover:underline text-sm">Tiếp tục mua sắm</Link>
      </div>
    </div>
  );
} 