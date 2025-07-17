import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTruck, faHeadset, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { products } from '../data/products';

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
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const navigate = useNavigate();
  if (!product) return <div style={{padding: 40, textAlign: 'center'}}>Không tìm thấy sản phẩm!</div>;

  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(product.variants[0].storage);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [showAddCartToast, setShowAddCartToast] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  // Lấy variant hiện tại theo dung lượng
  const currentVariant = product.variants.find(v => v.storage === selectedStorage) || product.variants[0];

  // State cho slider sản phẩm gợi ý
  const [suggestedStart, setSuggestedStart] = useState(0);
  const suggestedToShow = 5;
  const handlePrev = () => {
    setSuggestedStart(s => Math.max(0, s - 1));
  };
  const handleNext = () => {
    setSuggestedStart(s => Math.min(allSuggestedProducts.length - suggestedToShow, s + 1));
  };

  // Thêm hàm xử lý mua ngay
  const handleBuyNow = () => {
    const params = new URLSearchParams();
    params.set('buyNow', product.id);
    if (currentVariant && currentVariant.storage) params.set('storage', currentVariant.storage);
    navigate(`/checkout?${params.toString()}`);
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
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
          <div className="product-meta-tgdd">
            <span className="product-code-tgdd">Mã SP: {product.id}</span>
            <a href="#specs" className="spec-link-tgdd">Thông số kỹ thuật</a>
          </div>
          <div className="product-description-tgdd">{product.description}</div>
          <div className="product-warranty-tgdd">{product.warranty}</div>
          <div className="product-options-tgdd">
            <div className="option-label">Dung lượng</div>
            <div className="option-group">
              {product.variants.map((v, idx) => (
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
            <div className="option-group option-group-color">
              {product.colors.map((c, idx) => (
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
              <div className="current-price-tgdd">{currentVariant.price.toLocaleString()} đ</div>
              <div className="old-price-tgdd">{product.originalPrice.toLocaleString()} đ</div>
              <div className="installment-tgdd">{product.installment}</div>
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
        </div>
      </div>
      {/* Đánh giá và bình luận */}
      <div className="product-comments-section">
        <h2 className="comments-title">Đánh giá và bình luận</h2>
        <div className="rating-summary-block">
          <div className="rating-score">
            <div className="score-value">4.6</div>
            <div className="score-label">13 lượt đánh giá</div>
            <div className="score-stars">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={i <= 4 ? 'star active' : 'star'}>★</span>
              ))}
            </div>
            <button className="rate-btn">Đánh giá sản phẩm</button>
          </div>
          <div className="rating-bars">
            {[5,4,3,2,1].map(star => (
              <div className="rating-bar-row" key={star}>
                <span className="star-label">{star} <span className="star">★</span></span>
                <div className="bar-bg">
                  <div className="bar-fill" style={{width: star===5? '70%': star===4? '30%': star===3? '10%': '0%'}}></div>
                </div>
                <span className="bar-count">{star===5?9:star===4?3:star===3?1:0}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="comments-filter-row">
          <span className="comments-count">200 Bình luận</span>
          <div className="filter-btns">
            <button className="filter-btn active">Tất cả</button>
            {[5,4,3,2,1].map(star => (
              <button className="filter-btn" key={star}>{star} <span className="star">☆</span></button>
            ))}
          </div>
        </div>
        <form className="comment-form">
          <input type="text" className="comment-input" placeholder="Nhập nội dung bình luận..." maxLength={3000} />
          <span className="comment-char-count">0/3000</span>
          <button type="submit" className="comment-submit-btn highlight">Gửi bình luận</button>
        </form>
        <div className="comment-upload-tip">Thêm tối đa 5 ảnh và 1 video</div>
        <div className="comments-list">
          <div className="comment-item">
            <div className="comment-avatar">L</div>
            <div className="comment-main">
              <div className="comment-header">
                <span className="comment-author">Linh</span>
                <span className="comment-time">• một giờ trước</span>
              </div>
              <div className="comment-content">có được trả góp một nửa và trả thẳng một nửa còn lại không?</div>
              <div className="comment-actions">
                <button className="like-btn">👍 0</button>
                <button className="reply-btn">Trả lời</button>
              </div>
            </div>
          </div>
          <div className="comment-item reply">
            <div className="comment-avatar admin">F</div>
            <div className="comment-main">
              <div className="comment-header">
                <span className="comment-author">Lương Hoàng Đạt</span>
                <span className="admin-badge">Quản trị viên</span>
                <span className="comment-time">• một giờ trước</span>
              </div>
              <div className="comment-content">Chào bạn, bạn có thể chọn hình thức trả góp hoặc trả thẳng tuỳ ý khi thanh toán nhé!</div>
            </div>
          </div>
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
                <div className="suggested-product-price">{product.price.toLocaleString()}đ</div>
              </div>
            ))}
          </div>
          <button className="arrow-btn right" onClick={handleNext} disabled={suggestedStart >= allSuggestedProducts.length - suggestedToShow}>&#8594;</button>
        </div>
      </div>
    </div>
  );
}

