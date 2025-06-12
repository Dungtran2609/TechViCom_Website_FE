import React, { useState } from 'react';
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

  const categories = [
    { id: 1, name: 'Điện thoại', icon: <FaMobileAlt size={30} />, path: '/dien-thoai' },
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
            <Link to="/account" className="icon-button">
              <FaUser className="icon" />
            </Link>
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