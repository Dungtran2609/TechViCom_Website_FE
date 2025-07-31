import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import CartSidebar from './CartSidebar';
import './Header.css';
import api from '../../api';
import removeAccents from 'remove-accents';

// ✅ Hàm an toàn để đọc dữ liệu user từ localStorage
const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    if (userString && userString !== 'undefined') {
      return JSON.parse(userString);
    }
  } catch (error) {
    console.error('Lỗi khi đọc user:', error);
    localStorage.removeItem('user');
  }
  return null;
};

const Header = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(getUserFromStorage());
  const [isLoggedIn, setIsLoggedIn] = useState(!!getUserFromStorage());
  const userMenuRef = useRef(null);

  // Bắt sự kiện click ngoài để đóng popup tài khoản
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cập nhật lại user khi có sự kiện thay đổi
  useEffect(() => {
    const handleUserChange = () => {
      const updatedUser = getUserFromStorage();
      setUser(updatedUser);
      setIsLoggedIn(!!updatedUser);
    };
    window.addEventListener('userChanged', handleUserChange);
    return () => window.removeEventListener('userChanged', handleUserChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    window.dispatchEvent(new Event('userChanged'));
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="header relative z-50">
        <div className="container">
          {/* Logo và Menu */}
          <div className="left-section">
            <Link to="/" className="logo">
              <img src="/images/logo/logon.jpg" alt="Techvicom Logo" className="logo-image" />
            </Link>
          </div>

          {/* Thanh tìm kiếm có thể thêm ở đây nếu bạn cần */}

          {/* Tài khoản + Giỏ hàng */}
          <div className="right-section" style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
            {/* Tài khoản */}
            <div style={{ position: 'relative' }}>
              <button className="header-action-btn" onClick={() => setIsUserMenuOpen(v => !v)}>
                <FaUser className="user-icon" />
                <span>Tài khoản</span>
              </button>

              {isUserMenuOpen && (
                <div className="account-popup-modern" ref={userMenuRef}>
                  {isLoggedIn ? (
                    <>
                      <div className="account-popup-header">
                        <img src={user?.avatar || '/images/avatar-default.png'} alt="Avatar" className="account-popup-avatar" />
                        <div className="account-popup-user-info">
                          <div className="account-popup-username">{user?.name || 'Tài khoản'}</div>
                          {user?.email && <div className="account-popup-email">{user.email}</div>}
                        </div>
                      </div>
                      <div className="account-popup-actions">
                        <Link to="/account" className="account-popup-link" onClick={() => setIsUserMenuOpen(false)}>
                          <FaUserCircle /> Thông tin tài khoản
                        </Link>
                        <button onClick={handleLogout} className="account-popup-link logout">
                          <FaSignOutAlt /> Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="account-popup-login">
                      <button className="account-btn login-btn" onClick={() => { setIsUserMenuOpen(false); navigate('/login'); }}>
                        <FaSignInAlt className="account-btn-icon" /> Đăng nhập
                      </button>
                      <button className="account-btn register-btn" onClick={() => { setIsUserMenuOpen(false); navigate('/register'); }}>
                        <FaUserPlus className="account-btn-icon" /> Đăng ký
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Giỏ hàng */}
            <button className="header-action-btn" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart className="icon" />
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar giỏ hàng */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {isCartOpen && <div className="cart-overlay open" onClick={() => setIsCartOpen(false)} />}
    </>
  );
};

export default Header;
