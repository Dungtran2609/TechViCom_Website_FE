import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTruck, faHeadset, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

// Dữ liệu recommendedProducts copy từ HomePage.jsx
const recommendedProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    price: 31990000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'blue'],
    promotion: 'Giảm thêm 3.000.000đ khi thanh toán qua VNPay'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'gray', 'purple'],
    promotion: 'Thu cũ đổi mới trợ giá đến 5 triệu'
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['black', 'blue'],
    promotion: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu'
  },
  {
    id: 4,
    name: 'Xiaomi 14 Pro',
    price: 23990000,
    originalPrice: 24990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'white'],
    promotion: 'Giảm 2.000.000đ khi thanh toán online'
  },
  {
    id: 5,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['blue', 'yellow'],
    promotion: 'Tặng PMH 500.000đ mua kèm phụ kiện'
  }
];

// Dữ liệu products và recommendedProducts copy từ HomePage.jsx
const allSuggestedProducts = [
  // recommendedProducts
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    price: 31990000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'blue'],
    promotion: 'Giảm thêm 3.000.000đ khi thanh toán qua VNPay'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'gray', 'purple'],
    promotion: 'Thu cũ đổi mới trợ giá đến 5 triệu'
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['black', 'blue'],
    promotion: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu'
  },
  {
    id: 4,
    name: 'Xiaomi 14 Pro',
    price: 23990000,
    originalPrice: 24990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'white'],
    promotion: 'Giảm 2.000.000đ khi thanh toán online'
  },
  {
    id: 5,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['blue', 'yellow'],
    promotion: 'Tặng PMH 500.000đ mua kèm phụ kiện'
  },
  // products từ HomePage
  {
    id: 6,
    name: 'TCL 60R 5G 4GB 128GB',
    price: 2990000,
    originalPrice: 3990000,
    image: '/images/products/tcl-60r.jpg',
    installment: 'Trả góp 0%',
    colors: ['black'],
    variants: [
      { storage: '128 GB', price: 2990000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 7,
    name: 'Nubia V70 Design 8GB 128GB',
    price: 2790000,
    originalPrice: 3990000,
    image: '/images/products/nubia-v70.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'blue', 'purple'],
    variants: [
      { storage: '128 GB', price: 2790000 },
      { storage: '256 GB', price: 3290000 }
    ],
    promotion: 'Cho thẻ HD Bank: Giảm 500.000đ đơn từ 5 triệu'
  },
  {
    id: 8,
    name: 'Xiaomi Poco M7 Pro 5G 8GB 256GB',
    price: 5990000,
    originalPrice: 6990000,
    image: '/images/products/poco-m7.jpg',
    installment: 'Trả góp 0%',
    colors: ['green', 'black', 'blue'],
    variants: [
      { storage: '256 GB', price: 5990000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 9,
    name: 'Samsung Galaxy M55 5G 256GB',
    price: 7390000,
    originalPrice: 8490000,
    image: '/images/products/samsung-m55.jpg',
    installment: 'Trả góp 0%',
    colors: ['black'],
    variants: [
      { storage: '256 GB', price: 7390000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 10,
    name: 'Honor X9c 5G 12GB 256GB',
    price: 8790000,
    originalPrice: 9490000,
    image: '/images/products/honor-x9c.jpg',
    installment: 'Trả góp 0%',
    colors: ['pink', 'black', 'gray'],
    variants: [
      { storage: '256 GB', price: 8790000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  }
];

export default function ProductDetailPage() {
  // Tất cả các hook ở đầu function!
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [showAddCartToast, setShowAddCartToast] = useState(false);
  const [suggestedStart, setSuggestedStart] = useState(0);
  const suggestedToShow = 5;
  const [showSelectStorageToast, setShowSelectStorageToast] = useState(false);

  // Đánh giá & bình luận
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewName, setReviewName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [filterStar, setFilterStar] = useState(0); // 0: all

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      const colors = Array.isArray(product.colors) ? product.colors : [];
      const storages = Array.isArray(product.storage) ? product.storage : [];
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (storages.length > 0) setSelectedStorage(storages[0]);
    }
  }, [product]);

  // Load đánh giá từ localStorage khi vào trang
  useEffect(() => {
    if (!product) return;
    const saved = localStorage.getItem(`reviews_${product.id}`);
    if (saved) setReviews(JSON.parse(saved));
  }, [product]);

  if (loading) {
    return <div style={{padding: 40, textAlign: 'center'}}>Đang tải sản phẩm...</div>;
  }
  if (!product) {
    return <div style={{padding: 40, textAlign: 'center'}}>Không tìm thấy sản phẩm!</div>;
  }

  // Từ đây trở đi, product chắc chắn đã tồn tại!
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const storages = Array.isArray(product.storage) ? product.storage : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];
  const currentVariant = variants.find(v => v.storage === selectedStorage) || variants[0] || null;

  // State cho slider sản phẩm gợi ý
  const handlePrev = () => {
    setSuggestedStart(s => Math.max(0, s - 1));
  };
  const handleNext = () => {
    setSuggestedStart(s => Math.min(allSuggestedProducts.length - suggestedToShow, s + 1));
  };

  // Thêm hàm xử lý mua ngay
  const handleBuyNow = () => {
    if (variants.length > 0 && !selectedStorage) {
      setShowSelectStorageToast(true);
      setTimeout(() => setShowSelectStorageToast(false), 1500);
      // Scroll đến phần chọn dung lượng
      document.querySelector('.option-group')?.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    const params = new URLSearchParams();
    params.set('buyNow', product.id);
    if (currentVariant && currentVariant.storage) params.set('storage', currentVariant.storage);
    navigate(`/checkout?${params.toString()}`);
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedStorage) {
      setShowSelectStorageToast(true);
      setTimeout(() => setShowSelectStorageToast(false), 1500);
      document.querySelector('.option-group')?.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(item => item.id === product.id && item.variant.storage === currentVariant.storage);
    if (idx > -1) {
      cart[idx].quantity += 1;
    } else {
      cart.push({ id: product.id, variant: currentVariant, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setShowAddCartToast(true);
    setTimeout(() => setShowAddCartToast(false), 1500);
  };

  // Tính điểm trung bình và số lượt đánh giá
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const ratingCount = reviews.length;

  // Đếm số đánh giá theo từng sao
  const starCounts = [0,0,0,0,0,0]; // 0 unused, 1-5
  reviews.forEach(r => { starCounts[r.rating]++; });

  // Lấy user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('user'));

  // Gửi đánh giá
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewRating === 0) return;
    if (!currentUser) return;
    const name = currentUser.name || 'Khách';
    const userId = currentUser.id;
    const newReview = {
      name,
      userId,
      rating: reviewRating,
      text: reviewText.trim(),
      time: Date.now(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${product.id}` , JSON.stringify(updated));
    setReviewText("");
    setReviewRating(0);
    setCharCount(0);
  };

  // Hiển thị thời gian tương đối
  function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'vừa xong';
    if (diff < 3600) return `${Math.floor(diff/60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff/3600)} giờ trước`;
    return `${Math.floor(diff/86400)} ngày trước`;
  }

  return (
    <div className="product-detail-tgdd">
      <div className="product-detail-breadcrumb">
        <a href="/">Trang chủ</a> / <a href="/dien-thoai">Điện thoại</a> / <span>{product.name}</span>
      </div>
      <div className="product-detail-main">
        {/* Left: Gallery/Slider */}
        <div className="product-gallery-tgdd">
          <div className="gallery-slider-bg">
            <img className="gallery-main-img" src={product.images ? product.images[mainImgIdx] : product.image} alt="main" />
            <div className="gallery-slider-nav">
              <span>{product.images ? `${mainImgIdx+1}/${product.images.length}` : '1/1'}</span>
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbnails">
              {product.images.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={`gallery-thumb${mainImgIdx === idx ? ' active' : ''}`}
                  onClick={() => setMainImgIdx(idx)}
                />
              ))}
            </div>
          )}

          {/* Thông tin nổi bật và chính sách sản phẩm */}
          <div className="product-extra-info">
            <div className="highlight-specs-block">
              <h3>Thông số nổi bật</h3>
              <div className="highlight-specs-list">
                {product.specs && product.specs.map((spec, idx) => (
                  <div className="highlight-spec-item" key={idx}><b>{spec.label}:</b> {spec.value}</div>
                ))}
              </div>
            </div>
            <div className="product-policy-block">
              <h3>Chính sách sản phẩm</h3>
              <ul className="policy-list">
                <li><FontAwesomeIcon icon={faShieldAlt} style={{color:'#e83a45', marginRight:8}} /> Hàng chính hãng - Bảo hành 12 tháng</li>
                <li><FontAwesomeIcon icon={faTruck} style={{color:'#e83a45', marginRight:8}} /> Miễn phí giao hàng toàn quốc</li>
                <li><FontAwesomeIcon icon={faHeadset} style={{color:'#e83a45', marginRight:8}} /> Kỹ thuật viên hỗ trợ trực tuyến</li>
              </ul>
            </div>
          </div>
          <div className="device-intro-section">
            <img className="device-intro-img" src={product.introImage || product.image} alt="intro" />
            <div className="device-intro-content">
              <div className={showFullIntro ? 'intro-text expanded' : 'intro-text'}>
                {showFullIntro ? (product.introFull || product.intro) : (product.intro ? product.intro.slice(0, 180) + (product.intro.length > 180 ? '...' : '') : 'Chưa có giới thiệu.')}
              </div>
              {product.intro && product.intro.length > 180 && (
                <button className="intro-toggle-btn" onClick={() => setShowFullIntro(!showFullIntro)}>
                  {showFullIntro ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Right: Info */}
        <div className="product-info-tgdd">
          <h1 className="product-title-tgdd">{product.name}</h1>
          {/* Hiển thị dung lượng nếu có */}
          {variants.length > 0 && (
            <div style={{margin:'8px 0',fontWeight:500,fontSize:15,color:'#ff6c2f'}}>
              Dung lượng khả dụng: {variants.map(v => v.storage).join(', ')}
            </div>
          )}
          <div className="product-meta-tgdd">
            <span className="product-code-tgdd">Mã SP: {product.id}</span>
            <a href="#specs" className="spec-link-tgdd">Thông số kỹ thuật</a>
          </div>
          <div className="product-description-tgdd">{product.description}</div>
          <div className="product-warranty-tgdd">{product.warranty}</div>
          <div className="product-options-tgdd">
            <div className="option-label">Dung lượng</div>
            <div className="option-group">
              {variants.map((v, idx) => (
                <button
                  key={v.storage}
                  className={`option-btn${selectedStorage === v.storage ? ' active' : ''}`}
                  onClick={() => setSelectedStorage(v.storage)}
                >
                  {v.storage}
                </button>
              ))}
            </div>
            <div className="option-label">Màu sắc</div>
            {colors.length > 0 && (
            <div className="option-group option-group-color">
                {colors.map((c, idx) => (
                <button
                  key={c}
                  className={`color-dot-btn${selectedColor === c ? ' active' : ''}`}
                  style={{
                    background: c,
                    border: c === 'white' ? '2px solid #ccc' : '2px solid #fff',
                    boxShadow: selectedColor === c ? '0 0 0 3px #e83a45' : 'none',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'inline-block',
                    marginRight: 10
                  }}
                  title={c}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
            )}
          </div>
          <div className="product-rating-block">
            <span className="rating-stars">
              {[1,2,3,4,5].map(i => (
                <FontAwesomeIcon
                  key={i}
                  icon={i <= (product.rating || 4.5) ? faStarSolid : faStarRegular}
                  style={{color: '#FFD600', marginRight: 2, fontSize: 22}}
                />
              ))}
            </span>
            <span className="rating-value">{(product.rating || 4.5).toFixed(1)}</span>
            <span className="rating-count">({product.ratingCount || 128} đánh giá)</span>
          </div>
          <div className="product-price-box-tgdd">
            <div className="product-price-block-tgdd">
              <div className="current-price-tgdd">
                {(currentVariant?.price || product.price || 0).toLocaleString()} đ
              </div>
              {product.originalPrice && (
                <div className="old-price-tgdd">
                  {product.originalPrice.toLocaleString()} đ
                </div>
              )}
              {product.installment && (
                <div className="installment-tgdd">{product.installment}</div>
              )}
            </div>
          </div>
          <div className="promotion-block-tgdd">
            <div className="promotion-title-tgdd">Khuyến mãi</div>
            <ul>
              <li>{product.promotion}</li>
            </ul>
          </div>
          <div className="product-action-tgdd">
            <button
              className="buy-btn-tgdd"
              onClick={handleBuyNow}
            >
              Mua ngay
            </button>
            <button className="addcart-btn-tgdd" onClick={handleAddToCart}>Thêm vào giỏ</button>
          </div>
          {showAddCartToast && (
            <div style={{position: 'fixed', top: 80, right: 32, zIndex: 9999, background: '#4caf50', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
              Đã thêm sản phẩm vào giỏ hàng!
            </div>
          )}
          {showSelectStorageToast && (
            <div style={{position: 'fixed', top: 80, right: 32, zIndex: 9999, background: '#e83a45', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.12)'}}>
              Vui lòng chọn dung lượng trước khi tiếp tục!
            </div>
          )}
        </div>
      </div>
      {/* Đánh giá và bình luận */}
      <div className="product-comments-section">
        <h2 className="comments-title">Đánh giá và bình luận</h2>
        <div className="rating-summary-block">
          <div className="rating-score">
            <div className="score-value">{avgRating}</div>
            <div className="score-label">{ratingCount} lượt đánh giá</div>
            <div className="score-stars">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={i <= Math.round(avgRating) ? 'star active' : 'star'}>★</span>
              ))}
            </div>
            <button className="rate-btn" onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}>Đánh giá sản phẩm</button>
          </div>
          <div className="rating-bars">
            {[5,4,3,2,1].map(star => (
              <div className="rating-bar-row" key={star}>
                <span className="star-label">{star} <span className="star">★</span></span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{width: ratingCount ? `${(starCounts[star]/ratingCount*100).toFixed(0)}%` : '0%'}}></div>
                </div>
                <span className="bar-count">{starCounts[star]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="comments-filter-row">
          <span className="comments-count">{reviews.length} Bình luận</span>
          <div className="filter-btns">
            <button className={`filter-btn${filterStar===0?' active':''}`} onClick={()=>setFilterStar(0)}>Tất cả</button>
            {[5,4,3,2,1].map(star => (
              <button className={`filter-btn${filterStar===star?' active':''}`} key={star} onClick={()=>setFilterStar(star)}>{star} <span className="star">☆</span></button>
            ))}
          </div>
        </div>
        <form className="comment-form redesigned" onSubmit={handleSubmitReview} style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 20, margin: '18px 0', border: '1px solid #f3f3f3',
        }}>
          {/* Nếu chưa đăng nhập, hiển thị thông báo và disable form */}
          {!currentUser && (
            <div style={{width:'100%', color:'#e83a45', fontWeight:600, fontSize:16, marginBottom:8}}>
              Bạn cần <a href="/login" style={{color:'#ff6c2f', textDecoration:'underline'}}>đăng nhập</a> để gửi đánh giá.
            </div>
          )}
          {/* Nếu đã đăng nhập, ẩn input tên và tự động lấy tên user */}
          {currentUser && (
            <div style={{flex:'0 0 180px', minWidth:120, maxWidth:200, height:40, display:'flex', alignItems:'center', color:'#888', fontSize:15, marginBottom:8}}>
              <span style={{fontWeight:600, color:'#222'}}>Tài khoản:</span>&nbsp;{currentUser.name}
              </div>
          )}
          {/* Nếu chưa đăng nhập, không cho nhập tên */}
          {/* <input ...> bị ẩn khi đã đăng nhập */}
          {/* Chọn sao và nội dung vẫn cho nhập nhưng disable nếu chưa đăng nhập */}
          <div className="rating-input-row redesigned" style={{display: 'flex', alignItems: 'center', gap: 4, minWidth: 140, marginBottom: 8}}>
            <span style={{color:'#888', fontSize:15, marginRight: 4}}>Chọn đánh giá:</span>
            {[1,2,3,4,5].map(i => (
              <span
                key={i}
                className={`star-input redesigned${i <= reviewRating ? ' active' : ''}`}
                style={{
                  cursor: currentUser ? 'pointer' : 'not-allowed', fontSize:22, color: i <= reviewRating ? '#FFD600' : '#ccc', transition: 'color 0.15s',
                  filter: i <= reviewRating ? 'drop-shadow(0 1px 2px #ffe082)' : 'none',
                  opacity: currentUser ? 1 : 0.5
                }}
                onClick={()=> currentUser && setReviewRating(i)}
                onMouseOver={e => currentUser && (e.target.style.color = '#FFD600')}
                onMouseOut={e => currentUser && (e.target.style.color = i <= reviewRating ? '#FFD600' : '#ccc')}
                role="button"
                aria-label={`Chọn ${i} sao`}
              >★</span>
            ))}
              </div>
          <div style={{flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 4}}>
            <textarea
              className="comment-input redesigned"
              placeholder={currentUser ? "Nhập nội dung bình luận..." : "Bạn cần đăng nhập để bình luận"}
              maxLength={3000}
              value={reviewText}
              onChange={e => { setReviewText(e.target.value); setCharCount(e.target.value.length); }}
              required
              rows={3}
              style={{resize:'vertical', borderRadius: 10, border: '1px solid #e0e0e0', padding: '12px 14px', fontSize: 15, color: '#222', background: '#fafafa', minHeight: 48, boxSizing: 'border-box'}}
              disabled={!currentUser}
            />
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span className="comment-char-count redesigned" style={{fontSize:13, color:'#888'}}>{charCount}/3000</span>
            </div>
          </div>
          <button type="submit" className="comment-submit-btn highlight redesigned" disabled={!reviewText.trim() || reviewRating===0 || !currentUser} style={{
            height: 44, minWidth: 120, borderRadius: 24, background: '#222', color: '#fff', fontWeight: 600, fontSize: 17, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: (!reviewText.trim() || reviewRating===0 || !currentUser) ? 'not-allowed' : 'pointer', transition: 'background 0.18s', marginLeft: 8, marginTop: 2
          }}>Gửi đánh giá</button>
        </form>
        <div className="comment-upload-tip">(Chỉ demo: Đánh giá sẽ được lưu trên trình duyệt của bạn)</div>
        <div className="comments-list">
          {reviews.length === 0 && <div style={{color:'#888',padding:'16px 0'}}>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</div>}
          {reviews.filter(r => filterStar===0 || r.rating===filterStar).map((r, idx) => (
            <div className="comment-item redesigned" key={idx} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 18, marginBottom: 18, border: '1px solid #f3f3f3', transition: 'box-shadow 0.2s',
            }}>
              <div className="comment-avatar redesigned" style={{
                width: 48, height: 48, borderRadius: '50%', background: '#ffe0b2', color: '#ff6c2f', fontWeight: 700, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', flexShrink: 0
              }}>{r.name.charAt(0).toUpperCase()}</div>
              <div className="comment-main redesigned" style={{flex: 1}}>
                <div className="comment-header redesigned" style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4}}>
                  <span className="comment-author redesigned" style={{fontWeight: 600, fontSize: 16, color: '#222'}}>{r.name}</span>
                  <span className="comment-stars redesigned" style={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={i <= r.rating ? 'star active' : 'star'} style={{color: i <= r.rating ? '#FFD600' : '#eee', fontSize: 16}}>★</span>
                    ))}
                  </span>
                  <span className="comment-time redesigned" style={{fontSize: 13, color: '#888', marginLeft: 8}}>{timeAgo(r.time)}</span>
                </div>
                <div className="comment-content redesigned" style={{fontSize: 15, color: '#333', lineHeight: 1.6, marginBottom: 8, whiteSpace: 'pre-line'}}>{r.text}</div>
                <div className="comment-actions redesigned" style={{display: 'flex', gap: 16}}>
                  <button className="like-btn redesigned" style={{background: 'none', border: 'none', color: '#ff9800', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', gap: 4}} title="Thích"><span role="img" aria-label="like">👍</span> Thích</button>
                  <button className="reply-btn redesigned" style={{background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', gap: 4}} title="Trả lời"><span role="img" aria-label="reply">💬</span> Trả lời</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Sản phẩm gợi ý */}
      <div className="suggested-products-section">
        <h2 className="suggested-title">Sản phẩm gợi ý</h2>
        <div className="suggested-products-wrapper">
          <button className="arrow-btn left" onClick={handlePrev} disabled={suggestedStart === 0}>&#8592;</button>
          <div className="suggested-products-list no-scroll">
            {allSuggestedProducts.slice(suggestedStart, suggestedStart + suggestedToShow).map(product => (
              <div className="suggested-product-card" key={product.id}>
                <img src={product.image} alt={product.name} className="suggested-product-img" />
                <div className="suggested-product-name">{product.name}</div>
                <div className="suggested-product-price-block">
                  <span className="suggested-product-price">{product.price.toLocaleString()}đ</span>
                  {product.originalPrice && product.originalPrice !== product.price && (
                    <span className="suggested-product-old-price">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                </div>
                {product.intro && (
                  <div className="suggested-product-intro" style={{fontSize: 13, color: '#666', marginTop: 4}}>
                    {product.intro.slice(0, 60)}{product.intro.length > 60 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="arrow-btn right" onClick={handleNext} disabled={suggestedStart >= allSuggestedProducts.length - suggestedToShow}>&#8594;</button>
        </div>
      </div>
    </div>
  );
}

