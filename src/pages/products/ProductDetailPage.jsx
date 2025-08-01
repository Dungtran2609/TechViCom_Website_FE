import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import './ProductDetailPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faTruck, faHeadset, faStar as faStarSolid, faSignInAlt, faHdd } from '@fortawesome/free-solid-svg-icons'; // Thêm icon
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { productAPI, userAPI } from '../../api';

const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [showAddCartToast, setShowAddCartToast] = useState(false);
  const [showSelectStorageToast, setShowSelectStorageToast] = useState(false);
  
  // ==========================================================
  // THAY ĐỔI: Sử dụng state cho popup thay vì toast
  // ==========================================================
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [filterStar, setFilterStar] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      
      try {
        const productData = await productAPI.getProductById(id);
        setProduct(productData);

        let suggestions = [];
        if (productData?.category) {
          const sameCategoryProducts = await productAPI.getProducts({ category: productData.category });
          suggestions = sameCategoryProducts.filter(p => p.id !== productData.id);
        }

        if (suggestions.length < 10) {
          const allProducts = await productAPI.getProducts();
          const otherProducts = allProducts.filter(p => 
            p.id !== productData.id && !suggestions.find(s => s.id === p.id)
          );
          
          const needed = 10 - suggestions.length;
          suggestions.push(...otherProducts.slice(0, needed));
        }
        
        setSuggestedProducts(suggestions.slice(0, 10));

      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (product) {
      const colors = Array.isArray(product.colors) ? product.colors : [];
      const storages = Array.isArray(product.storage) ? product.storage : [];
      if (colors.length > 0) setSelectedColor(colors[0]);
      if (storages.length > 0) setSelectedStorage(storages[0]);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const saved = localStorage.getItem(`reviews_${product.id}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, [product]);

  if (loading) {
    return <div style={{padding: 40, textAlign: 'center'}}>Đang tải sản phẩm...</div>;
  }
  if (!product) {
    return <div style={{padding: 40, textAlign: 'center'}}>Không tìm thấy sản phẩm!</div>;
  }

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const colors = Array.isArray(product.colors) ? product.colors : [];
  // Lấy danh sách các giá trị thuộc tính (ví dụ màu sắc) từ các biến thể
  // Lấy tất cả các thuộc tính của biến thể
  // Chuẩn hóa lấy thuộc tính từ tất cả biến thể
  const attributeGroups = {};
  variants.forEach(v => {
    if (Array.isArray(v.attribute_values)) {
      v.attribute_values.forEach(attr => {
        const key = attr.attribute?.slug || attr.attribute?.name || 'unknown';
        if (!attributeGroups[key]) attributeGroups[key] = { name: attr.attribute?.name || key, type: attr.attribute?.type, values: new Set() };
        // Nếu là color thì lấy cả value và color_code
        if (attr.attribute?.type === 'color') {
          attributeGroups[key].values.add(JSON.stringify({ value: attr.value, color_code: attr.color_code }));
        } else {
          attributeGroups[key].values.add(attr.value);
        }
      });
    }
  });

  // Chuyển sang mảng để render
  // Chuyển sang mảng để render
  const attributeOptions = Object.entries(attributeGroups).map(([key, group]) => ({
    key,
    name: group.name,
    type: group.type,
    values: group.type === 'color'
      ? Array.from(group.values).map(v => JSON.parse(v))
      : Array.from(group.values)
  }));

  // State cho từng thuộc tính được chọn

  // Khi chọn thuộc tính
  // Khi chọn thuộc tính
  const handleAttributeSelect = (attrKey, value) => {
    setSelectedAttributes(prev => ({ ...prev, [attrKey]: value }));
  };

  // Xác định biến thể hiện tại dựa trên các thuộc tính đã chọn
  // Xác định biến thể hiện tại dựa trên các thuộc tính đã chọn
  const currentVariant = variants.find(v => {
    if (!Array.isArray(v.attribute_values)) return false;
    // Phải match toàn bộ thuộc tính đã chọn
    return Object.entries(selectedAttributes).every(([attrKey, val]) => {
      return v.attribute_values.some(attr => {
        const key = attr.attribute?.slug || attr.attribute?.name || 'unknown';
        if (attributeGroups[key].type === 'color') {
          // val có thể là object { value, color_code }
          if (typeof val === 'object' && val !== null) {
            return attr.value === val.value && attr.color_code === val.color_code;
          }
          // Nếu chỉ truyền color_code thì vẫn match
          return attr.color_code === val || attr.value === val;
        }
        return attr.value === val;
      });
    });
  }) || null;

  // ====================================================================
  // SỬA ĐỔI Ở ĐÂY: Hàm Mua Ngay sẽ hiển thị popup
  // ====================================================================
  const handleBuyNow = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setShowLoginPopup(true); // Hiển thị popup
      return;
    }

    if (variants.length > 0 && !selectedStorage) {
      setShowSelectStorageToast(true);
      setTimeout(() => setShowSelectStorageToast(false), 1500);
      document.querySelector('.option-group')?.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    const params = new URLSearchParams();
    params.set('buyNow', product.id);
    if (currentVariant?.storage) params.set('storage', currentVariant.storage);
    navigate(`/checkout?${params.toString()}`);
  };

  // ====================================================================
  // SỬA ĐỔI Ở ĐÂY: Hàm Thêm vào giỏ sẽ hiển thị popup
  // ====================================================================
  const handleAddToCart = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setShowLoginPopup(true); // Hiển thị popup
      return;
    }

    // Kiểm tra thuộc tính cần chọn (ví dụ storage)
    if (variants.length > 0) {
      // Tìm thuộc tính đầu tiên của biến thể (ví dụ storage, color...)
      const requiredAttr = attributeOptions[0]?.key;
      if (requiredAttr && !selectedAttributes[requiredAttr]) {
        setShowSelectStorageToast(true);
        setTimeout(() => setShowSelectStorageToast(false), 1500);
        document.querySelector('.option-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    let currentCart = currentUser.cart || [];
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id && item.variant?.storage === currentVariant?.storage);

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ id: product.id, variant: currentVariant, quantity: 1 });
    }

    try {
      const updatedUser = await userAPI.updateUser(currentUser.id, { cart: currentCart });
      // Đảm bảo luôn lưu cart vào localStorage, kể cả khi API không trả về cart
      const userToSave = { ...updatedUser, cart: currentCart };
      localStorage.setItem('user', JSON.stringify(userToSave));
      window.dispatchEvent(new Event('userChanged'));
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      return;
    }

    setShowAddCartToast(true);
    setTimeout(() => setShowAddCartToast(false), 1500);
    window.dispatchEvent(new Event('storage'));
  };

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const ratingCount = reviews.length;
  const starCounts = [0,0,0,0,0,0]; 
  reviews.forEach(r => { starCounts[r.rating]++; });
  const currentUser = getCurrentUser();

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || reviewRating === 0 || !currentUser) return;
    const newReview = {
      name: currentUser.name || 'Khách',
      userId: currentUser.id,
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

  function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'vừa xong';
    if (diff < 3600) return `${Math.floor(diff/60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff/3600)} giờ trước`;
    return `${Math.floor(diff/86400)} ngày trước`;
  }

  return (
    <div className="product-detail-tgdd">
      {/* ========================================================== */}
      {/* THÊM MỚI: JSX cho popup yêu cầu đăng nhập */}
      {/* ========================================================== */}
      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup-content">
            <FontAwesomeIcon icon={faSignInAlt} className="login-popup-icon" />
            <h2>Yêu cầu đăng nhập</h2>
            <p>Vui lòng đăng nhập hoặc tạo tài khoản để tiếp tục mua sắm.</p>
            <div className="login-popup-actions">
              <button className="login-btn-secondary" onClick={() => setShowLoginPopup(false)}>
                Để sau
              </button>
              <button className="login-btn-primary" onClick={() => navigate('/login')}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="product-detail-breadcrumb">
        <a href="/">Trang chủ</a> / <a href="/dien-thoai">Điện thoại</a> / <span>{product.name}</span>
      </div>
      <div className="product-detail-main">
        <div className="product-gallery-tgdd">
          <div className="gallery-slider-bg">
            <img
              className="gallery-main-img"
              src={(() => {
                let imgSrc = currentVariant && currentVariant.image
                  ? currentVariant.image
                  : (product.images && product.images.length > 0
                      ? product.images[mainImgIdx]
                      : product.image);
                if (imgSrc && !imgSrc.startsWith('http')) {
                  imgSrc = `http://localhost:8000/storage/${imgSrc.replace(/^storage[\\\/]/, '')}`;
                }
                return imgSrc;
              })()}
              alt="main"
            />
            <div className="gallery-slider-nav">
              <span>{product.images && product.images.length > 0 ? `${mainImgIdx+1}/${product.images.length}` : '1/1'}</span>
            </div>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="gallery-thumbs-tgdd">
              {product.images.map((img, idx) => {
                let thumbSrc = img;
                if (thumbSrc && !thumbSrc.startsWith('http')) {
                  thumbSrc = `http://localhost:8000/storage/${thumbSrc.replace(/^storage[\\\/]/, '')}`;
                }
                return (
                  <div
                    key={img}
                    className={`gallery-thumb-tgdd${mainImgIdx === idx ? ' active' : ''}`}
                    onClick={() => setMainImgIdx(idx)}
                  >
                    <img src={thumbSrc} alt={`thumb-${idx}`} />
                  </div>
                );
              })}
            </div>
          )}
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
        <div className="product-info-tgdd">
          <h1 className="product-title-tgdd">{product.name}</h1>
          {variants.length > 0 && (
            <div style={{margin:'8px 0',fontWeight:500,fontSize:15,color:'#ff6c2f',display:'flex',alignItems:'center',gap:'8px'}}>
              <FontAwesomeIcon icon={faHdd} style={{fontSize:16}} />
              Dung lượng khả dụng: {variants.map(v => v.storage).join(', ')}
            </div>
          )}
          <div className="product-meta-tgdd">
            <span className="product-code-tgdd">Mã SP: {product.sku || product.id}</span>
            <a href="#specs" className="spec-link-tgdd">Thông số kỹ thuật</a>
          </div>
          {/* Mô tả ngắn */}
          {product.short_description && (
            <div className="product-short-description-tgdd" style={{marginBottom:8}}>{product.short_description}</div>
          )}
          {/* Mô tả dài (HTML) */}
          {product.long_description && (
            <div className="product-long-description-tgdd" style={{marginBottom:8}} dangerouslySetInnerHTML={{__html: product.long_description}} />
          )}
          {/* Ảnh thumbnail */}
          {product.thumbnail && (
            <div style={{marginBottom:8}}>
              <img src={product.thumbnail.startsWith('http') ? product.thumbnail : `http://localhost:8000/storage/${product.thumbnail.replace(/^storage[\\/]/, '')}`} alt="thumbnail" style={{maxWidth:180,borderRadius:8}} />
            </div>
          )}
          {/* Bảo hành */}
          {product.warranty && (
            <div className="product-warranty-tgdd">{product.warranty}</div>
          )}
          {/* Thông tin biến thể chi tiết */}
          {/* Thông tin biến thể chi tiết: chỉ log ra console để kiểm tra */}
          {variants.length > 0 && (() => { console.log('Variants:', variants); return null; })()}
          <div className="product-options-tgdd">
            {/* Hiển thị các nhóm thuộc tính để chọn */}
            {attributeOptions.map(attr => (
              <div key={attr.key} style={{marginBottom:8}}>
                <div className="option-label">{attr.name}</div>
                <div className="option-group" style={{display:'flex',gap:8}}>
                  {attr.values.map(val => (
                    attr.type === 'color' ? (
                      <button
                        key={val.value}
                        className={`color-dot-btn${JSON.stringify(selectedAttributes[attr.key]) === JSON.stringify(val) ? ' active' : ''}`}
                        style={{ background: val.color_code, width:32, height:32, borderRadius:'50%', border:JSON.stringify(selectedAttributes[attr.key]) === JSON.stringify(val) ? '2px solid #e83a45' : '1px solid #ccc', cursor:'pointer' }}
                        title={val.value}
                        onClick={() => handleAttributeSelect(attr.key, val)}
                      />
                    ) : (
                      <button
                        key={val}
                        className={`option-btn${selectedAttributes[attr.key] === val ? ' active' : ''}`}
                        style={{ minWidth:60, padding:'6px 12px', borderRadius:6, border:selectedAttributes[attr.key] === val ? '2px solid #e83a45' : '1px solid #ccc', cursor:'pointer' }}
                        onClick={() => handleAttributeSelect(attr.key, val)}
                      >
                        {val}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
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
                {(() => {
                  if (currentVariant) {
                    const price = currentVariant.sale_price && Number(currentVariant.sale_price) > 0
                      ? Number(currentVariant.sale_price)
                      : Number(currentVariant.price);
                    return price.toLocaleString() + ' đ';
                  }
                  // Nếu không có biến thể thì lấy giá sản phẩm
                  return (product.price ? Number(product.price).toLocaleString() : '0 đ');
                })()}
              </div>
              {currentVariant && currentVariant.price && currentVariant.sale_price && Number(currentVariant.sale_price) < Number(currentVariant.price) ? (
                <div className="old-price-tgdd">
                  {Number(currentVariant.price).toLocaleString()} đ
                </div>
              ) : (
                product.originalPrice && (
                  <div className="old-price-tgdd">
                    {Number(product.originalPrice).toLocaleString()} đ
                  </div>
                )
              )}
              {(currentVariant && currentVariant.installment) ? (
                <div className="installment-tgdd">{currentVariant.installment}</div>
              ) : (
                product.installment && (
                  <div className="installment-tgdd">{product.installment}</div>
                )
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
            <div className="toast-notification success">
              Đã thêm sản phẩm vào giỏ hàng!
            </div>
          )}
          {showSelectStorageToast && (
            <div className="toast-notification error">
              Vui lòng chọn dung lượng trước khi tiếp tục!
            </div>
          )}
        </div>
      </div>
      <div className="product-comments-section">
        <h2 className="comments-section-title">Đánh giá & Nhận xét về {product.name}</h2>
        <div className="rating-summary-block">
          <div className="rating-summary-left">
            <div className="average-score-display">
              <p className="average-score">{avgRating}<span>/5</span></p>
            </div>
            <div className="average-stars">
              {[1,2,3,4,5].map(i => (
                  <FontAwesomeIcon key={i} icon={faStarSolid} className={i <= Math.round(avgRating) ? 'star-icon active' : 'star-icon'} />
              ))}
            </div>
            <p className="total-reviews-text">({ratingCount} đánh giá)</p>
          </div>
          <div className="rating-summary-right">
            <div className="rating-bars">
              {[5,4,3,2,1].map(star => (
                <div className="rating-bar-row" key={star}>
                  <span className="star-label">{star} <FontAwesomeIcon icon={faStarSolid}/></span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{width: ratingCount ? `${(starCounts[star]/ratingCount*100).toFixed(0)}%` : '0%'}}></div>
                  </div>
                  <span className="bar-count">{starCounts[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="comments-filter-row">
          <span className="comments-count">{reviews.length} Bình luận</span>
          <div className="filter-btns">
            <button className={`filter-btn${filterStar===0?' active':''}`} onClick={()=>setFilterStar(0)}>Tất cả</button>
            {[5,4,3,2,1].map(star => (
              <button className={`filter-btn${filterStar===star?' active':''}`} key={star} onClick={()=>setFilterStar(star)}>{star} ★</button>
            ))}
          </div>
        </div>
        <div className="review-form-card">
          {!currentUser ? (
            <div className="login-prompt">
              Vui lòng <Link to="/login">đăng nhập</Link> để gửi đánh giá của bạn.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-header">
                <p>Đánh giá của bạn</p>
                <div className="rating-input-stars">
                {[1,2,3,4,5].map(i => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStarSolid}
                    className={`star-selector ${i <= reviewRating ? 'selected' : ''}`}
                    onClick={()=> setReviewRating(i)}
                  />
                ))}
                </div>
              </div>
              <textarea
                className="comment-textarea"
                placeholder={`Bạn nghĩ sao về sản phẩm ${product.name}?`}
                maxLength={3000}
                value={reviewText}
                onChange={e => { setReviewText(e.target.value); setCharCount(e.target.value.length); }}
                required
                rows={4}
              />
              <div className="form-footer">
                <span className="char-counter">{charCount}/3000</span>
                <button type="submit" className="submit-review-btn" disabled={!reviewText.trim() || reviewRating===0}>
                  Gửi đánh giá
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="comments-list">
          {reviews.length === 0 && <div className="no-reviews-message">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</div>}
          {reviews.filter(r => filterStar===0 || r.rating===filterStar).map((r, idx) => (
            <div className="comment-card" key={idx}>
              <div className="comment-avatar">{r.name.charAt(0).toUpperCase()}</div>
              <div className="comment-main">
                <div className="comment-header">
                  <div className="comment-author-info">
                    <span className="comment-author">{r.name}</span>
                    <span className="comment-time">{timeAgo(r.time)}</span>
                  </div>
                  <div className="comment-rating">
                    {[1,2,3,4,5].map(i => (
                      <FontAwesomeIcon key={i} icon={faStarSolid} className={`star-icon ${i <= r.rating ? 'active' : ''}`} />
                    ))}
                  </div>
                </div>
                <div className="comment-content">{r.text}</div>
                <div className="comment-actions">
                  <button className="action-btn"><span role="img" aria-label="like">👍</span> Thích</button>
                  <button className="action-btn"><span role="img" aria-label="reply">💬</span> Trả lời</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="suggested-products-section">
        <h2 className="suggested-title">Sản phẩm tương tự</h2>
        {suggestedProducts.length > 0 ? (
          <div className="slider-container">
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={5}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 12 },
                640: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 5, spaceBetween: 24 },
              }}
              className="suggested-products-slider"
            >
              {suggestedProducts.map(p => (
                <SwiperSlide key={p.id}>
                  <Link to={`/product/${p.id}`} className="suggested-product-card-new">
                    <div className="suggested-product-img-wrapper">
                      <img src={p.image} alt={p.name} className="suggested-product-img" />
                    </div>
                    <h3 className="suggested-product-name">{p.name}</h3>
                    <div className="suggested-product-price-block">
                      <span className="suggested-product-price">{p.price.toLocaleString()}đ</span>
                      {p.originalPrice && (
                        <span className="suggested-product-old-price">{p.originalPrice.toLocaleString()}đ</span>
                      )}
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-button-prev-custom"></div>
            <div className="swiper-button-next-custom"></div>
          </div>
        ) : (
          <div style={{color:'#888', padding:'16px 0', textAlign: 'center'}}>Không có sản phẩm gợi ý nào.</div>
        )}
      </div>
    </div>
  );
}