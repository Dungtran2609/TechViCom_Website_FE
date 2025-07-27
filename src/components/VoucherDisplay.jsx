import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaGift, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getVouchers } from '../api/vouchers';
import './VoucherDisplay.css';

const VoucherDisplay = ({ limit = 5 }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    fetchActiveVouchers();
  }, []);

  const fetchActiveVouchers = async () => {
    try {
      const allVouchers = await getVouchers();
      const currentDate = new Date();
      
      // Lọc voucher đang hoạt động
      const activeVouchers = allVouchers.filter(voucher => {
        console.log('Checking voucher:', voucher.code, 'isActive:', voucher.isActive);
        if (!voucher.isActive) {
          console.log('Voucher', voucher.code, 'is not active');
          return false;
        }
        
        // Tạm thời bỏ qua date filter để test
        const hasUsageLeft = voucher.usedCount < voucher.usageLimit;
        
        console.log('Voucher', voucher.code, 'usage left:', hasUsageLeft);
        
        return hasUsageLeft;
      });
      
      console.log('Active vouchers found:', activeVouchers.length);
      console.log('All vouchers:', allVouchers.length);
      setVouchers(activeVouchers);
      setShowNavigation(activeVouchers.length > 3);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountText = (voucher) => {
    switch (voucher.discountType) {
      case 'percentage':
        return `Giảm ${voucher.discountValue}%`;
      case 'fixed':
        return `Giảm ${voucher.discountValue.toLocaleString()}đ`;
      case 'shipping':
        return 'Miễn phí vận chuyển';
      default:
        return 'Giảm giá';
    }
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Hết hạn';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} ngày`;
    if (hours > 0) return `${hours} giờ`;
    return 'Sắp hết hạn';
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, vouchers.length - 3);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(limit)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (vouchers.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 voucher-container">
      <div className="flex items-center gap-2 mb-4">
        <FaGift className="text-orange-500 text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">Mã giảm giá hôm nay</h2>
      </div>
      
      <div className="relative voucher-slider">
        <div 
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white relative overflow-hidden voucher-card hover:scale-105 transition-transform duration-300 min-w-[300px]">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaTicketAlt className="text-white" />
                    <span className="font-mono font-bold text-lg">{voucher.code}</span>
                  </div>
                  <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {getTimeRemaining(voucher.endDate)}
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2 text-sm">{voucher.name}</h3>
                <p className="text-xs opacity-90 mb-3">{voucher.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded">
                    {getDiscountText(voucher)}
                  </span>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-xs" />
                    <span>Đơn tối thiểu {voucher.minOrderValue.toLocaleString()}đ</span>
                  </div>
                </div>
                
                <div className="mt-3 text-xs opacity-75">
                  Đã sử dụng: {voucher.usedCount}/{voucher.usageLimit}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        {showNavigation && vouchers.length > 3 && (
          <>
            <button 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 z-10 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <button 
              onClick={nextSlide}
              disabled={currentIndex >= vouchers.length - 3}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110 z-10 ${currentIndex >= vouchers.length - 3 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <FaChevronRight className="text-lg" />
            </button>
          </>
        )}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Sử dụng mã voucher khi thanh toán để được giảm giá
        </p>
      </div>
    </div>
  );
};

export default VoucherDisplay; 