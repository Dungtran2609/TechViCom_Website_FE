import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart, FaSignInAlt, FaUserPlus, FaChevronRight, FaSearch, FaFire, FaSignOutAlt, FaUserCircle, FaClipboardList, FaFilter, FaTimesCircle, FaExclamationCircle, FaTag, FaTimes } from 'react-icons/fa';
import { ThemeToggle } from '../../contexts/ThemeContext';
import './Header.css';
import CartSidebar from './CartSidebar';
import removeAccents from 'remove-accents';
import { useNotificationActions } from '../notificationHooks';
import { productAPI, categoryAPI } from '../../api/api.js';


const Header = () => {
  const { success } = useNotificationActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();
  const [productSearch, setProductSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    category: '', color: '', storage: '', priceMin: '', priceMax: ''
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);



  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const data = await categoryAPI.getCategories();
        setCategories(data);
      } catch (err) {
        setCategoriesError(err.message);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    removeAccents(category.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())) ||
    (category.subcategories?.some(sub =>
      removeAccents(sub.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
    ))
  );

  const allColors = Array.from(new Set(products.flatMap(p => p.colors || [])));
  const allStorages = Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.storage) || [])));
  const allCategories = Array.from(new Set(products.map(p => p.category)));
  const allBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  // Danh sách brand cố định để hiển thị - chỉ đến HP
  const allowedBrands = [
    "Apple", "Samsung", "Xiaomi", "Google", "OnePlus", "OPPO", "Defunc", "Hoa Phat", "Unie", "Dell", "Lenovo", "HP"
  ];
  const displayBrands = allBrands.filter(brand => allowedBrands.includes(brand));

  const normalize = (str) => removeAccents((str || '').toLowerCase().trim());

  const suggestions = products.filter(p => {
    const q = normalize(productSearch);
    const matchText = [p.name, p.description, p.intro].map(normalize).join(' ');
    const match = q === '' || matchText.includes(q);
    const matchCategory = !filter.category || p.category === filter.category;
    const matchColor = !filter.color || p.colors?.includes(filter.color);
    const matchStorage = !filter.storage || p.variants?.some(v => v.storage === filter.storage);
    const matchPrice = (!filter.priceMin || p.price >= +filter.priceMin) && (!filter.priceMax || p.price <= +filter.priceMax);
    return match && matchCategory && matchColor && matchStorage && matchPrice;
  }).slice(0, 5);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setHoveredCategory(null);
        setSearchTerm('');
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
        const u = localStorage.getItem('user');
        setUser(u ? JSON.parse(u) : null);
        setIsLoggedIn(!!u);
        
        // Reset search state khi user thay đổi
        setProductSearch('');
        setShowSuggestions(false);
        setSearchTerm('');
        setHoveredCategory(null);
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    window.addEventListener('userChanged', handleUserChange);
    handleUserChange(); // Initial check

    return () => {
        window.removeEventListener('userChanged', handleUserChange);
    };
}, []);


  const currentCategory = categories.find(cat => cat.id === hoveredCategory);

  const handleProductSearch = (e) => {
    e.preventDefault();
    if (productSearch.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        navigate(`/products?q=${encodeURIComponent(productSearch.trim())}`);
        setProductSearch('');
        setShowSuggestions(false);
        setIsSearching(false);
      }, 300);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        navigate(`/products?q=${encodeURIComponent(mobileSearchTerm.trim())}`);
        setMobileSearchTerm('');
        setIsMobileSearchOpen(false);
        setIsSearching(false);
      }, 300);
    }
  };

  const handleMobileInputChange = (e) => {
    setMobileSearchTerm(e.target.value);
  };

  // Debug: Log mobile search state
  useEffect(() => {
    console.log('Mobile search state:', { isMobileSearchOpen, mobileSearchTerm });
  }, [isMobileSearchOpen, mobileSearchTerm]);

  const handleInputChange = (e) => {
    setProductSearch(e.target.value);
    setShowSuggestions(e.target.value.trim().length > 0);
  };

  const handleLogout = () => {
    const userName = user?.name || user?.phone || 'Người dùng';
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    setIsUserMenuOpen(false);
    
    // Hiển thị thông báo đăng xuất
    success(`Đã đăng xuất thành công! Tạm biệt ${userName}.`, 'Đăng xuất thành công');
    
    navigate('/');
  };

  return (
    <>
      <header className="header relative z-50">
        <div className="container">
          <div className="left-section">
            <Link to="/" className="logo">
              <img src="/images/logo/logon.jpg" alt="Logo" className="logo-image" />
            </Link>
            <div className="menu-container" ref={menuRef}>
              <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaBars className="menu-icon" />
                <span>Danh mục</span>
              </button>
              {isMenuOpen && (
                <div className="categories-menu">
                  <div className="categories-container" onMouseLeave={() => setHoveredCategory(null)}>
                    {/* Cột mới: Thương hiệu (bên trái) */}
                    <div className="brand-filter-column">
                      <div className="brand-filter-title">
                        <FaTag className="brand-icon" />
                        Thương hiệu
                      </div>
                      <div className="brand-filter-list">
                       {displayBrands.map(brand => (
                          <Link
                            key={brand}
                            to={`/products?brand=${encodeURIComponent(brand)}`}
                            className="brand-filter-item"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FaTag style={{ fontSize: 14, marginRight: 6, opacity: 0.7 }} />
                            {brand}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="main-categories">
                      <div className="category-search">
                        <div className="search-input-wrapper">
                          <FaSearch className="search-icon" />
                          <input type="text" placeholder="Tìm kiếm danh mục..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="category-search-input" />
                        </div>
                      </div>
                      <div className="hot-categories">
                        <div className="hot-categories-header">
                          <FaFire className="fire-icon" />
                          <span>Danh mục hot</span>
                        </div>
                        <div className="hot-categories-grid">
                          {categories.filter(cat => cat.isHot).slice(0, 4).map((category) => (
                            <Link key={category.id} to={`/products${category.path}`} className="hot-category-item" onClick={() => setIsMenuOpen(false)}>
                              <div className="hot-category-icon">
                                <FaTag size={20} style={{ color: '#ff6c2f' }} />
                              </div>
                              <span>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="all-categories">
                        <div className="all-categories-header"><span>Tất cả danh mục</span></div>
                        {categoriesLoading ? (
                          <div className="no-category-found">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto mb-2"></div>
                            <span>Đang tải danh mục...</span>
                          </div>
                        ) : categoriesError ? (
                          <div className="no-category-found">
                            <FaExclamationCircle />
                            <span>Lỗi tải danh mục</span>
                          </div>
                        ) : filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <div key={category.id} className={`category-item ${category.isHot ? 'hot-category' : ''}`} onMouseEnter={() => setHoveredCategory(category.id)}>
                              <Link to={`/products${category.path}`} className="category-link" onClick={() => setIsMenuOpen(false)}>
                                <div className="category-icon">
                                  <FaTag size={24} style={{ color: '#ff6c2f' }} />
                                </div>
                                <span className="category-name">{category.name}</span>
                                {category.isHot && <FaFire className="hot-indicator" />}
                                <FaChevronRight className="chevron-icon" />
                              </Link>
                            </div>
                          ))
                        ) : (
                          <div className="no-category-found"><FaExclamationCircle /><span>Không tìm thấy danh mục phù hợp.</span></div>
                        )}
                      </div>
                    </div>
                    {hoveredCategory && currentCategory && (
                      <div className="subcategories-panel">
                        <div className="subcategories-header">
                          <h3>{currentCategory.name}</h3>
                          <Link to={`/products${currentCategory.path}`} className="view-all-link">Xem tất cả</Link>
                        </div>
                        <div className="subcategories-content">
                          <div className="subcategories-list">
                            {currentCategory.subcategories.slice(0, 4).map((sub) => (
                              <Link key={sub.path} to={sub.path} className={`subcategory-item ${sub.isPopular ? 'popular' : ''}`} onClick={() => setIsMenuOpen(false)}>
                                {sub.name}
                                {sub.isPopular && <span className="popular-badge">Hot</span>}
                              </Link>
                            ))}
                          </div>
                          {(() => {
                            // Lấy sản phẩm nổi bật tự động từ products theo category
                            const categorySlug = currentCategory.path.replace('/', '');
                            const featuredProducts = products
                              .filter(p => p.category === categorySlug && p.isFeatured)
                              .slice(0, 2); // Chỉ lấy 2 sản phẩm nổi bật
                            
                            if (featuredProducts.length > 0) {
                              return (
                                <div className="featured-products">
                                  <h4>Sản phẩm nổi bật</h4>
                                  <div className="featured-products-grid">
                                    {featuredProducts.map((product) => (
                                      <Link key={product.id} to={`/product/${product.id}`} className="featured-product-item" onClick={() => setIsMenuOpen(false)}>
                                        <img src={product.image} alt={product.name} />
                                        <div className="product-info">
                                          <span className="product-name">{product.name}</span>
                                          <span className="product-price">{product.price.toLocaleString()}đ</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
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
                <input type="text" placeholder="Nhập để tìm kiếm sản phẩm..." className="search-input" value={productSearch} onChange={handleInputChange} onFocus={() => setShowSuggestions(productSearch.trim().length > 0)} disabled={isSearching} />
                <button type="submit" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: isSearching ? 'not-allowed' : 'pointer', color: '#ff6c2f', fontSize: 18, opacity: isSearching ? 0.6 : 1 }} aria-label="Tìm kiếm" disabled={isSearching}>
                  {isSearching ? <div className="loading-spinner"></div> : <FaSearch />}
                </button>
                {showSuggestions && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 1000, marginTop: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 12px 8px 12px', margin: '8px', boxShadow: '0 2px 8px #eee', position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 12 }}>
                      <FaFilter style={{ position: 'absolute', left: 10, top: 10, color: '#ff6c2f', fontSize: 18 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 110 }}>
                        <label style={{ fontSize: 11, color: '#888', marginBottom: 2, marginLeft: 2 }}>Danh mục</label>
                        <select value={filter.category} onChange={e => setFilter(f => ({ ...f, category: e.target.value }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', fontSize: 13 }}>
                          <option value=''>Tất cả</option>
                          {allCategories.map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 90 }}>
                        <label style={{ fontSize: 11, color: '#888', marginBottom: 2, marginLeft: 2 }}>Màu sắc</label>
                        <select value={filter.color} onChange={e => setFilter(f => ({ ...f, color: e.target.value }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', fontSize: 13 }}>
                          <option value=''>Tất cả</option>
                          {allColors.map(c => (<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 90 }}>
                        <label style={{ fontSize: 11, color: '#888', marginBottom: 2, marginLeft: 2 }}>Dung lượng</label>
                        <select value={filter.storage} onChange={e => setFilter(f => ({ ...f, storage: e.target.value }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', fontSize: 13 }}>
                          <option value=''>Tất cả</option>
                          {allStorages.map(s => (<option key={s} value={s}>{s}</option>))}
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 80 }}>
                        <label style={{ fontSize: 11, color: '#888', marginBottom: 2, marginLeft: 2 }}>Giá từ</label>
                        <input type='number' placeholder='Từ' value={filter.priceMin} onChange={e => setFilter(f => ({ ...f, priceMin: e.target.value }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', fontSize: 13 }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 80 }}>
                        <label style={{ fontSize: 11, color: '#888', marginBottom: 2, marginLeft: 2 }}>Đến</label>
                        <input type='number' placeholder='Đến' value={filter.priceMax} onChange={e => setFilter(f => ({ ...f, priceMax: e.target.value }))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #eee', fontSize: 13 }} />
                      </div>
                      <button onClick={() => setFilter({ category: '', color: '', storage: '', priceMin: '', priceMax: '' })} style={{ background: 'none', border: 'none', color: '#ff6c2f', fontSize: 18, marginLeft: 8, cursor: 'pointer', alignSelf: 'center' }} title='Xoá lọc'>
                        <FaTimesCircle />
                      </button>
                    </div>
                    <div style={{ height: 1, background: '#eee', margin: '0 8px 4px 8px' }} />
                    {suggestions.map((product, idx) => (
                      <Link key={product.id} to={`/product/${product.id}`} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: idx < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background-color 0.2s', textDecoration: 'none', color: 'inherit' }} onClick={() => { setShowSuggestions(false); setProductSearch(''); }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{product.price.toLocaleString()}đ</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="right-section" style={{ gap: 15, display: 'flex', alignItems: 'center' }}>
            
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={() => setIsUserMenuOpen((v) => !v)} className="header-action-btn">
                <FaUser className="user-icon" />
                <span>Tài khoản</span>
              </button>
              {isUserMenuOpen && (
                <div ref={userMenuRef} className="account-popup-modern">
                  {isLoggedIn ? (
                    <>
                      <div className="account-popup-header">
                        <img src={user?.avatar || '/images/avatar-default.png'} alt="avatar" className="account-popup-avatar" />
                        <div className="account-popup-user-info">
                          <div className="account-popup-username">{user?.name || 'Tài khoản'}</div>
                          {user?.email && <div className="account-popup-email">{user.email}</div>}
                        </div>
                      </div>
                      {/* ========================================================== */}
                      {/* SỬA LỖI Ở ĐÂY: Xóa nút "Lịch sử mua hàng" */}
                      {/* ========================================================== */}
                      <div className="account-popup-actions">
                        <Link to="/account" onClick={() => setIsUserMenuOpen(false)} className="account-popup-link">
                          <FaUserCircle /> Thông tin tài khoản
                        </Link>
                        {/* Nút "Lịch sử mua hàng" đã được xóa */}
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
            <ThemeToggle className="header-action-btn" />
            <button className="header-action-btn" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart className="icon" />
              <span>Giỏ hàng</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay" onClick={() => setIsMobileSearchOpen(false)}>
          <div className="mobile-search-container" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-search-header">
              <h3 className="mobile-search-title">Tìm kiếm sản phẩm</h3>
              <button 
                className="mobile-search-close"
                onClick={() => setIsMobileSearchOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleMobileSearch}>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                className="mobile-search-input"
                value={mobileSearchTerm}
                onChange={handleMobileInputChange}
                autoFocus
              />
              <button type="submit" className="mobile-search-btn" disabled={isSearching}>
                {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>
          </div>
        </div>
      )}

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      {isCartOpen && <div className={`cart-overlay${isCartOpen ? ' open' : ''}`} onClick={() => setIsCartOpen(false)} />}
    </>
  );
};

export default Header;