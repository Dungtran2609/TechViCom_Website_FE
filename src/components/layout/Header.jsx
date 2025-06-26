import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart, FaMobileAlt, FaLaptop, FaHeadphones } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { BsFan } from 'react-icons/bs';
import { IoPhonePortrait } from 'react-icons/io5';
import './Header.css';
import logo from '../../image/logo.png';
import CartSidebar from './CartSidebar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const categories = [
    { id: 1, name: 'Điện thoại', icon: <FaMobileAlt size={30} />, path: '/products' },
    { id: 2, name: 'Laptop', icon: <FaLaptop size={30} />, path: '/laptop' },
    { id: 3, name: 'Điều hòa', icon: <MdAir size={30} />, path: '/may-lanh' },
    { id: 4, name: 'Tủ lạnh', icon: <MdKitchen size={30} />, path: '/tu-lanh' },
    { id: 5, name: 'Điện gia dụng', icon: <MdKitchen size={30} />, path: '/dien-gia-dung' },
    { id: 6, name: 'Máy tính bảng', icon: <FaLaptop size={30} />, path: '/may-tinh-bang' },
    { id: 7, name: 'Phụ kiện', icon: <FaHeadphones size={30} />, path: '/phu-kien' },
    { id: 8, name: 'SIM FPT', icon: <IoPhonePortrait size={30} />, path: '/sim-fpt' },
    { id: 9, name: 'Quạt điều hòa', icon: <BsFan size={30} />, path: '/quat-dieu-hoa' }
  ];

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="left-section">
            <Link to="/" className="logo">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
            <div className="menu-container">
              <button 
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars className="menu-icon" />
                <span>Danh mục</span>
              </button>
              {isMenuOpen && (
                <div className="categories-menu">
                  <div className="categories-grid">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        to={category.path}
                        className="category-item"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="category-icon">{category.icon}</div>
                        <span className="category-name">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search-section">
            <input
              type="text"
              placeholder="Nhập để tìm kiếm sản phẩm..."
              className="search-input"
            />
          </div>

          <div className="right-section">
            <div className="relative" ref={userMenuRef}>
              <button
                className="icon-button"
                onClick={() => setShowUserMenu((v) => !v)}
                aria-label="Tài khoản"
              >
                <FaUser className="icon" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border z-50 animate-fade-in p-4">
                  <div className="mb-2 px-2 text-gray-700 font-semibold text-base flex items-center gap-2">
                    <FaUser className="text-orange-500" />
                    Tài khoản của bạn
                  </div>
                  <div className="my-2 border-t border-gray-100" />
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition font-medium text-base"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l4-4m-4 4l4 4m13-4a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition font-medium text-base"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
            <button 
              className="cart-button"
              onClick={() => setIsCartOpen(true)}
            >
              <FaShoppingCart className="icon" />
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {isCartOpen && (
        <div 
          className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
};

export default Header; 