import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart, FaMobileAlt, FaLaptop, FaHeadphones, FaSignInAlt, FaUserPlus, FaChevronRight, FaSearch, FaFire } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { BsFan } from 'react-icons/bs';
import { IoPhonePortrait } from 'react-icons/io5';
import { GiWashingMachine } from 'react-icons/gi';
import { FaTabletAlt } from 'react-icons/fa';
import './Header.css';
import logo from '../../image/logo.png';
import CartSidebar from './CartSidebar';
import { products } from '../../data/products';
import { motion } from 'framer-motion';
import { categories } from '../../data/categories';

// Tạo iconMap để ánh xạ tên icon sang component
const iconMap = {
  FaMobileAlt,
  FaLaptop,
  FaHeadphones,
  MdAir,
  MdKitchen,
  BsFan,
  IoPhonePortrait,
  GiWashingMachine,
  FaTabletAlt,
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [productSearch, setProductSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Lọc sản phẩm gợi ý
  const suggestions = productSearch.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setHoveredCategory(null);
        setSearchTerm('');
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    if (isUserMenuOpen || isMenuOpen || showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMenuOpen, showSuggestions]);

  const currentCategory = categories.find(cat => cat.id === hoveredCategory);

  const handleProductSearch = async (e) => {
    e.preventDefault();
    if (productSearch.trim()) {
      setIsSearching(true);
      // Simulate loading time
      setTimeout(() => {
        navigate(`/products?q=${encodeURIComponent(productSearch.trim())}`);
        setProductSearch('');
        setShowSuggestions(false);
        setIsSearching(false);
      }, 300);
    }
  };

  const handleSuggestionClick = (productName) => {
    setIsSearching(true);
    setTimeout(() => {
      setProductSearch(productName);
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(productName)}`);
      setIsSearching(false);
    }, 200);
  };

  const handleInputChange = (e) => {
    setProductSearch(e.target.value);
    setShowSuggestions(e.target.value.trim().length > 0);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="left-section">
            <Link to="/" className="logo">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
            <div className="menu-container" ref={menuRef}>
              <button 
                className="menu-button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars className="menu-icon" />
                <span>Danh mục</span>
              </button>
              {isMenuOpen && (
                <div className="categories-menu">
                  <div 
                    className="categories-container"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="main-categories">
                      {/* Search Bar */}
                      <div className="category-search">
                        <div className="search-input-wrapper">
                          <FaSearch className="search-icon" />
                          <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="category-search-input"
                          />
                        </div>
                      </div>

                      {/* Hot Categories */}
                      <div className="hot-categories">
                        <div className="hot-categories-header">
                          <FaFire className="fire-icon" />
                          <span>Danh mục hot</span>
                        </div>
                        <div className="hot-categories-grid">
                          {categories.filter(cat => cat.isHot).slice(0, 4).map((category) => (
                            <Link
                              key={category.id}
                              to={category.path}
                              className="hot-category-item"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="hot-category-icon">
                                {iconMap[category.icon] && React.createElement(iconMap[category.icon], { size: 20, style: { color: '#ff6c2f' } })}
                              </div>
                              <span>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* All Categories */}
                      <div className="all-categories">
                        <div className="all-categories-header">
                          <span>Tất cả danh mục</span>
                        </div>
                        {filteredCategories.map((category) => (
                          <div 
                            key={category.id}
                            className={`category-item ${category.isHot ? 'hot-category' : ''}`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                          >
                            <Link 
                              to={category.path}
                              className="category-link"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="category-icon">
                                {iconMap[category.icon] && React.createElement(iconMap[category.icon], { size: 24, style: { color: '#ff6c2f' } })}
                              </div>
                              <span className="category-name">{category.name}</span>
                              {category.isHot && <FaFire className="hot-indicator" />}
                              <FaChevronRight className="chevron-icon" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {hoveredCategory && currentCategory && (
                      <div className="subcategories-panel">
                        <div className="subcategories-header">
                          <h3>{currentCategory.name}</h3>
                          <Link to={currentCategory.path} className="view-all-link">
                            Xem tất cả
                          </Link>
                        </div>
                        
                        <div className="subcategories-content">
                          <div className="subcategories-list">
                            {currentCategory.subcategories.slice(0, 4).map((sub, index) => (
                              <Link
                                key={index}
                                to={sub.path}
                                className={`subcategory-item ${sub.isPopular ? 'popular' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {sub.name}
                                {sub.isPopular && <span className="popular-badge">Hot</span>}
                              </Link>
                            ))}
                          </div>
                          
                          {currentCategory.featuredProducts && (
                            <div className="featured-products">
                              <h4>Sản phẩm nổi bật</h4>
                              <div className="featured-products-grid">
                                {currentCategory.featuredProducts.map((product, index) => (
                                  <Link
                                    key={index}
                                    to={`/product/${product.id}`}
                                    className="featured-product-item"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-info">
                                      <span className="product-name">{product.name}</span>
                                      <span className="product-price">{product.price}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search-section">
            <form onSubmit={handleProductSearch} style={{ width: '100%' }}>
              <div ref={searchRef} style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder="Nhập để tìm kiếm sản phẩm..."
                  className="search-input"
                  value={productSearch}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(productSearch.trim().length > 0)}
                  disabled={isSearching}
                />
                <button type="submit" style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  color: '#ff6c2f',
                  fontSize: 18,
                  opacity: isSearching ? 0.6 : 1
                }} aria-label="Tìm kiếm" disabled={isSearching}>
                  {isSearching ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <FaSearch />
                  )}
                </button>
                {/* Dropdown gợi ý sản phẩm nếu có */}
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      zIndex: 1000,
                      marginTop: '4px',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {suggestions.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(product.name)}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '2px'
                          }}>
                            {product.name}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#6b7280'
                          }}>
                            {product.price.toLocaleString()}đ
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </form>
          </div>

          <div className="right-section" style={{gap: 15, display: 'flex', alignItems: 'center'}}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="header-action-btn"
              >
                <FaUser className="user-icon" style={{ color: '#fff', fontSize: 22, transition: 'color 0.2s' }} />
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 16, transition: 'color 0.2s' }}>Tài khoản</span>
              </button>
              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="account-popup-modern"
                  style={{ left: 0, top: '110%', right: 'auto', position: 'absolute', transform: 'none' }}
                >
                  <Link
                    to="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="account-popup-btn login-btn"
                  >
                    <FaSignInAlt style={{ fontSize: 20 }} />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="account-popup-btn register-btn"
                  >
                    <FaUserPlus style={{ fontSize: 20 }} />
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
            <button 
              className="header-action-btn"
              onClick={() => setIsCartOpen(true)}
            >
              <FaShoppingCart className="icon" style={{ color: '#fff', fontSize: 22 }} />
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 16 }}>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {isCartOpen && (
        <div 
          className={`cart-overlay${isCartOpen ? ' open' : ''}`}
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
};

export default Header;