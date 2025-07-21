import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaUser, FaShoppingCart, FaMobileAlt, FaLaptop, FaHeadphones, FaSignInAlt, FaUserPlus, FaChevronRight, FaSearch, FaFire, FaSignOutAlt, FaUserCircle, FaClipboardList, FaFilter, FaTimesCircle } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { BsFan } from 'react-icons/bs';
import { IoPhonePortrait } from 'react-icons/io5';
import { GiWashingMachine } from 'react-icons/gi';
import { FaTabletAlt } from 'react-icons/fa';
import './Header.css';
import logo from '../../image/logo.png';
import CartSidebar from './CartSidebar';
// import { products } from '../../data/products';
import { motion } from 'framer-motion';
// import { categories } from '../../data/categories';
import removeAccents from 'remove-accents';

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
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    category: '',
    color: '',
    storage: '',
    priceMin: '',
    priceMax: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.subcategories && category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  // Lấy danh sách màu và dung lượng từ products
  const allColors = Array.from(new Set(products.flatMap(p => p.colors || [])));
  const allStorages = Array.from(new Set(products.flatMap(p => (p.variants || []).map(v => v.storage))));
  const allCategories = Array.from(new Set(products.map(p => p.category)));

  // Hàm chuẩn hoá chuỗi tìm kiếm
  function normalize(str) {
    return removeAccents((str || '').toLowerCase().trim());
  }

  // Lọc sản phẩm nâng cao
  const suggestions = products.filter(p => {
    // Tìm kiếm theo nhiều trường
    const q = normalize(productSearch);
    const matchText = [p.name, p.description, p.intro, p.introFull].map(normalize).join(' ');
    const match = q === '' || matchText.includes(q);
    // Lọc theo filter
    const matchCategory = !filter.category || p.category === filter.category;
    const matchColor = !filter.color || (p.colors && p.colors.includes(filter.color));
    const matchStorage = !filter.storage || (p.variants && p.variants.some(v => v.storage === filter.storage));
    const matchPrice = (!filter.priceMin || (p.price >= +filter.priceMin)) && (!filter.priceMax || (p.price <= +filter.priceMax));
    return match && matchCategory && matchColor && matchStorage && matchPrice;
  }).slice(0, 5);

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

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const userObj = JSON.parse(u);
      fetch(`http://localhost:3001/users/${userObj.id}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem('user');
          setUser(null);
          setIsLoggedIn(false);
          // Nếu đang ở trang tài khoản thì chuyển về login
          if (location.pathname.startsWith('/account')) {
            navigate('/login');
          }
        });
    }
  }, [location]);

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    localStorage.setItem('success', 'Đăng xuất thành công!');
    window.dispatchEvent(new Event('userChanged'));
    navigate('/');
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
                              to={`/products${category.path}`}
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
                              to={`/products${category.path}`}
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
                          <Link to={`/products${currentCategory.path}`} className="view-all-link">
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
                {showSuggestions && (
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
                    {/* Bộ lọc nâng cao */}
                    <div style={{background:'#f8fafc',borderRadius:12,padding:'12px 12px 8px 12px',margin:'8px',boxShadow:'0 2px 8px #eee',position:'relative',display:'flex',flexWrap:'wrap',alignItems:'flex-end',gap:12}}>
                      <FaFilter style={{position:'absolute',left:10,top:10,color:'#ff6c2f',fontSize:18}} />
                      <div style={{display:'flex',flexDirection:'column',minWidth:110}}>
                        <label style={{fontSize:11,color:'#888',marginBottom:2,marginLeft:2}}>Danh mục</label>
                        <select value={filter.category} onChange={e=>setFilter(f=>({...f,category:e.target.value}))} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #eee',fontSize:13}}>
                          <option value=''>Tất cả</option>
                          {allCategories.map(c=>(<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',minWidth:90}}>
                        <label style={{fontSize:11,color:'#888',marginBottom:2,marginLeft:2}}>Màu sắc</label>
                        <select value={filter.color} onChange={e=>setFilter(f=>({...f,color:e.target.value}))} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #eee',fontSize:13}}>
                          <option value=''>Tất cả</option>
                          {allColors.map(c=>(<option key={c} value={c}>{c}</option>))}
                        </select>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',minWidth:90}}>
                        <label style={{fontSize:11,color:'#888',marginBottom:2,marginLeft:2}}>Dung lượng</label>
                        <select value={filter.storage} onChange={e=>setFilter(f=>({...f,storage:e.target.value}))} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #eee',fontSize:13}}>
                          <option value=''>Tất cả</option>
                          {allStorages.map(s=>(<option key={s} value={s}>{s}</option>))}
                        </select>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',minWidth:80}}>
                        <label style={{fontSize:11,color:'#888',marginBottom:2,marginLeft:2}}>Giá từ</label>
                        <input type='number' placeholder='Từ' value={filter.priceMin} onChange={e=>setFilter(f=>({...f,priceMin:e.target.value}))} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #eee',fontSize:13}} />
                      </div>
                      <div style={{display:'flex',flexDirection:'column',minWidth:80}}>
                        <label style={{fontSize:11,color:'#888',marginBottom:2,marginLeft:2}}>Đến</label>
                        <input type='number' placeholder='Đến' value={filter.priceMax} onChange={e=>setFilter(f=>({...f,priceMax:e.target.value}))} style={{padding:'6px 10px',borderRadius:8,border:'1px solid #eee',fontSize:13}} />
                      </div>
                      <button onClick={()=>setFilter({category:'',color:'',storage:'',priceMin:'',priceMax:''})} style={{background:'none',border:'none',color:'#ff6c2f',fontSize:18,marginLeft:8,cursor:'pointer',alignSelf:'center'}} title='Xoá lọc'>
                        <FaTimesCircle />
                      </button>
                    </div>
                    <div style={{height:1,background:'#eee',margin:'0 8px 4px 8px'}} />
                    {suggestions.map((product, index) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'background-color 0.2s',
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                        onClick={() => {
                          setShowSuggestions(false);
                          setProductSearch('');
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
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
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {product.price.toLocaleString()}đ
                          </div>
                        </div>
                      </Link>
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
                <FaUser className="user-icon" />
                <span>Tài khoản</span>
              </button>
              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  className="account-popup-modern"
                  style={{
                    left: 0,
                    top: '110%',
                    right: 'auto',
                    position: 'absolute',
                    transform: 'none',
                    minWidth: 200,
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                    padding: 0,
                    overflow: 'hidden',
                    zIndex: 1000
                  }}
                >
                  {isLoggedIn ? (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '16px 16px 10px 16px',
                        borderBottom: '1px solid #f3f3f3',
                        background: '#fff7ed'
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: '#ffe0b2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <FaUserCircle style={{ fontSize: 24, color: '#ff9800' }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: '#ff6c2f' }}>
                            {user?.phone || user?.username || 'Tài khoản'}
                          </div>
                          {user?.email && (
                            <div style={{ fontSize: 12, color: '#888' }}>{user.email}</div>
                          )}
                        </div>
                      </div>
                      <div style={{padding: '14px 32px 14px 32px', display: 'flex', flexDirection: 'column', gap: 12}}>
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px',
                            fontSize: 16, color: '#222', textDecoration: 'none', border: '2px solid #ff9800',
                            borderRadius: 12, background: '#fff', fontWeight: 600, justifyContent: 'center',
                            transition: 'background 0.2s, color 0.2s, border 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.color = '#ff9800'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#222'; }}
                        >
                          <FaUserCircle style={{ fontSize: 20, color: '#222', marginRight: 8 }} />
                          Thông tin cá nhân
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px',
                            fontSize: 16, color: '#222', textDecoration: 'none', border: '2px solid #ff9800',
                            borderRadius: 12, background: '#fff', fontWeight: 600, justifyContent: 'center',
                            transition: 'background 0.2s, color 0.2s, border 0.2s',
                            cursor: 'pointer'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#fff7ed'; e.currentTarget.style.color = '#ff9800'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#222'; }}
                        >
                          <FaClipboardList style={{ fontSize: 20, color: '#222', marginRight: 8 }} />
                          Đơn hàng của tôi
                        </Link>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0',
                            fontSize: 16, color: '#e53935', background: '#fff', border: '2px solid #e53935',
                            borderRadius: 12, fontWeight: 600, justifyContent: 'center',
                            marginTop: 8, cursor: 'pointer', transition: 'background 0.2s, color 0.2s, border 0.2s'
                          }}
                          onMouseOver={e => { e.currentTarget.style.background = '#ffebee'; e.currentTarget.style.color = '#b71c1c'; }}
                          onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#e53935'; }}
                        >
                          <FaSignOutAlt style={{ fontSize: 20, color: '#e53935', marginRight: 8 }} />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 24px 24px 24px', minWidth: 240}}>
                      <button
                        className="account-btn login-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/login');
                        }}
                      >
                        <FaSignInAlt className="account-btn-icon" />
                        Đăng nhập
                      </button>
                      <button
                        className="account-btn register-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/register');
                        }}
                      >
                        <FaUserPlus className="account-btn-icon" />
                        Đăng ký
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button 
              className="header-action-btn"
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
          className={`cart-overlay${isCartOpen ? ' open' : ''}`}
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </>
  );
};

export default Header;