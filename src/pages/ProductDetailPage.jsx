import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetailPage.css';

const productData = {
  id: 1,
  name: 'iPhone 15 Pro Max 256GB',
  code: 'No.00911048',
  rating: 4.4,
  reviews: 15,
  image: '/images/products/iphone-15-pro.jpg',
  gallery: [
    '/images/products/iphone-15-pro.jpg',
    '/images/products/iphone-15-pro.jpg',
    '/images/products/iphone-15-pro.jpg',
    '/images/products/iphone-15-pro.jpg',
  ],
  variants: [
    { storage: '256 GB', price: 30590000 },
    { storage: '512 GB', price: 34990000 },
    { storage: '1 TB', price: 38990000 },
  ],
  colors: [
    { name: 'Titan Sa Mạc', code: '#e5d9c5' },
    { name: 'Titan Đen', code: '#222' },
    { name: 'Titan Tự nhiên', code: '#bfc1c2' },
    { name: 'Titan Trắng', code: '#eee' },
  ],
  selectedColor: 0,
  selectedVariant: 0,
  price: 30590000,
  originalPrice: 34990000,
  installment: '2.430.112 đ/tháng',
  promotion: '+7.647 Điểm thưởng',
  offers: [
    'Giảm ngay 4,400,000đ áp dụng đến 19/06',
    'Nâng đời iPhone An Tâm - Đặc quyền chỉ 2,000,000đ',
    'AirPods giảm đến 500,000đ khi mua kèm iPhone',
    'Giảm thêm 3 triệu khi mua kèm SIM FPT F299/F399 6-12 tháng',
    'Trả góp 0%'
  ],
  chip: 'Apple A18 Pro',
  screen: '6.9 inch',
  battery: '33 Giờ',
  highlights: [
    'Hàng chính hãng - Bảo hành 12 tháng',
    'Miễn phí giao hàng toàn quốc',
    'Kỹ thuật viên hỗ trợ trực tuyến'
  ]
};

const phoneProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    price: 31990000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'blue'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Giảm thêm 3.000.000đ khi thanh toán qua VNPay'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'gray', 'purple'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Thu cũ đổi mới trợ giá đến 5 triệu'
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'blue'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu'
  },
  {
    id: 4,
    name: 'Xiaomi 14 Pro',
    price: 23990000,
    originalPrice: 24990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Giảm 2.000.000đ khi thanh toán online'
  },
  {
    id: 5,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    installment: 'Trả góp 0%',
    colors: ['blue', 'gold'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng PMH 500.000đ mua kèm phụ kiện'
  },
  {
    id: 6,
    name: 'Google Pixel 8 Pro',
    price: 22990000,
    originalPrice: 24990000,
    image: '/images/products/pixel-8-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'blue'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng đồng hồ Pixel Watch 2 trị giá 8 triệu'
  },
  {
    id: 7,
    name: 'OnePlus 12',
    price: 19990000,
    originalPrice: 21990000,
    image: '/images/products/oneplus-12.jpg',
    installment: 'Trả góp 0%',
    colors: ['green', 'black'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng tai nghe OnePlus Buds Pro 2'
  },
  {
    id: 8,
    name: 'Realme GT5 Pro',
    price: 16990000,
    originalPrice: 18990000,
    image: '/images/products/realme-gt5.jpg',
    installment: 'Trả góp 0%',
    colors: ['red', 'blue'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Giảm 1.000.000đ khi thanh toán qua VNPAY'
  },
  {
    id: 9,
    name: 'Nothing Phone (2)',
    price: 15990000,
    originalPrice: 16990000,
    image: '/images/products/nothing-phone-2.jpg',
    installment: 'Trả góp 0%',
    colors: ['white', 'black'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng ốp lưng chính hãng trị giá 790.000đ'
  },
  {
    id: 10,
    name: 'Huawei P60 Pro',
    price: 24990000,
    originalPrice: 26990000,
    image: '/images/products/huawei-p60.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'purple'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng Watch GT4 trị giá 6.990.000đ'
  },
  {
    id: 11,
    name: 'iPhone 15 Pro Max 256GB',
    price: 31990000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'blue'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Giảm thêm 3.000.000đ khi thanh toán qua VNPay'
  },
  {
    id: 12,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'gray', 'purple'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Thu cũ đổi mới trợ giá đến 5 triệu'
  },
  {
    id: 13,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'blue'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu'
  },
  {
    id: 14,
    name: 'Xiaomi 14 Pro',
    price: 23990000,
    originalPrice: 24990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Giảm 2.000.000đ khi thanh toán online'
  },
  {
    id: 15,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    installment: 'Trả góp 0%',
    colors: ['blue', 'gold'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng PMH 500.000đ mua kèm phụ kiện'
  },
  {
    id: 16,
    name: 'Google Pixel 8 Pro',
    price: 22990000,
    originalPrice: 24990000,
    image: '/images/products/pixel-8-pro.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'blue'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng đồng hồ Pixel Watch 2 trị giá 8 triệu'
  },
  {
    id: 17,
    name: 'OnePlus 12',
    price: 19990000,
    originalPrice: 21990000,
    image: '/images/products/oneplus-12.jpg',
    installment: 'Trả góp 0%',
    colors: ['green', 'black'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng tai nghe OnePlus Buds Pro 2'
  },
  {
    id: 18,
    name: 'Realme GT5 Pro',
    price: 16990000,
    originalPrice: 18990000,
    image: '/images/products/realme-gt5.jpg',
    installment: 'Trả góp 0%',
    colors: ['red', 'blue'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Giảm 1.000.000đ khi thanh toán qua VNPAY'
  },
  {
    id: 19,
    name: 'Nothing Phone (2)',
    price: 15990000,
    originalPrice: 16990000,
    image: '/images/products/nothing-phone-2.jpg',
    installment: 'Trả góp 0%',
    colors: ['white', 'black'],
    variants: [
      { storage: '256 GB' }
    ],
    promotion: 'Tặng ốp lưng chính hãng trị giá 790.000đ'
  },
  {
    id: 20,
    name: 'Huawei P60 Pro',
    price: 24990000,
    originalPrice: 26990000,
    image: '/images/products/huawei-p60.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'white', 'purple'],
    variants: [
      { storage: '256 GB' },
      { storage: '512 GB' }
    ],
    promotion: 'Tặng Watch GT4 trị giá 6.990.000đ'
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const product = productData;
  const [showFullDesc, setShowFullDesc] = useState(false);
  const productDescription = `iPhone 15 Pro Max là siêu phẩm mới nhất của Apple với thiết kế sang trọng, khung viền titan siêu bền, màn hình 6.9 inch sắc nét và hiệu năng vượt trội nhờ chip Apple A18 Pro. Camera nâng cấp mạnh mẽ với nhiều tính năng chụp ảnh chuyên nghiệp, quay video 4K, hỗ trợ chống rung và zoom quang học. Pin dung lượng lớn cho thời gian sử dụng lên đến 33 giờ, sạc nhanh và sạc không dây tiện lợi. Máy còn hỗ trợ kết nối 5G, WiFi 6E, Face ID, chuẩn kháng nước IP68 và nhiều tiện ích thông minh khác. Đây là lựa chọn hoàn hảo cho người dùng yêu công nghệ, đam mê trải nghiệm đỉnh cao và mong muốn sở hữu một chiếc smartphone cao cấp nhất hiện nay.`;

  // Lấy các sản phẩm gợi ý khác sản phẩm đang xem
  const suggested = phoneProducts.filter(p => p.id !== Number(id));

  // Slider logic
  const sliderRef = useRef(null);
  const scrollBy = 240; // px, bằng width item + gap
  const handleScrollLeft = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: -scrollBy, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: scrollBy, behavior: 'smooth' });
  };

  return (
    <div className="product-detail-outer">
      <div className="product-detail-grid">
        {/* Left: Gallery */}
        <div className="product-gallery">
          <div className="gallery-main">
            <img src={product.gallery[selectedColor]} alt={product.name} />
          </div>
          <div className="gallery-thumbs">
            {product.gallery.map((img, idx) => (
              <img key={idx} src={img} alt={`thumb${idx+1}`} className="thumb" />
            ))}
          </div>
        </div>
        {/* Right: Info */}
        <div className="product-info-block">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            <span className="product-code">{product.code}</span>
            <span className="product-rating">⭐ {product.rating} <span className="review-count">({product.reviews} đánh giá)</span></span>
            <a href="#specs" className="spec-link">Thông số kỹ thuật</a>
          </div>
          <div className="product-options">
            <div className="option-label">Dung lượng</div>
            <div className="option-group">
              {product.variants.map((v, idx) => (
                <button key={v.storage} className={`option-btn${selectedVariant===idx?' active':''}`} onClick={()=>setSelectedVariant(idx)}>{v.storage}</button>
              ))}
            </div>
            <div className="option-label">Màu sắc</div>
            <div className="option-group">
              {product.colors.map((c, idx) => (
                <button key={c.name} className={`color-btn${selectedColor===idx?' active':''}`} style={{backgroundColor: c.code}} title={c.name} onClick={()=>setSelectedColor(idx)}></button>
              ))}
            </div>
          </div>
          <div className="product-price-box">
            <div className="price-main">{product.variants[selectedVariant].price.toLocaleString()} đ</div>
            <div className="price-old">{product.originalPrice.toLocaleString()} đ <span className="discount">13%</span></div>
            <div className="promotion-point">{product.promotion}</div>
          </div>
          <div className="installment-box">
            <div className="installment-label">Trả góp</div>
            <div className="installment-value">{product.installment}</div>
          </div>
          <ul className="product-offers-list">
            {product.offers.map((offer, idx) => (
              <li key={idx}>{offer}</li>
            ))}
          </ul>
          <div className="product-actions">
            <Link to="/checkout" state={{ product }} className="buy-btn">Mua ngay</Link>
            <Link to="/checkout" state={{ product }} className="add-cart-btn">Thêm vào giỏ</Link>
          </div>
        </div>
      </div>
      {/* Thông số nổi bật và chính sách */}
      <div className="product-detail-extra">
        <div className="product-detail-inner">
          <div className="specs-policies">
            <div className="specs-block">
              <div className="spec-title">Thông số nổi bật</div>
              <div className="spec-row"><b>Chip</b>: {product.chip}</div>
              <div className="spec-row"><b>Kích thước màn hình</b>: {product.screen}</div>
              <div className="spec-row"><b>Thời lượng pin</b>: {product.battery}</div>
            </div>
            <div className="policies-block">
              <div className="policy-row">🔒 Hàng chính hãng - Bảo hành 12 tháng</div>
              <div className="policy-row">🚚 Miễn phí giao hàng toàn quốc</div>
              <div className="policy-row">🛠️ Kỹ thuật viên hỗ trợ trực tuyến</div>
            </div>
          </div>
        </div>
      </div>
      {/* Thông tin mô tả sản phẩm */}
      <div className="product-desc-block">
        <img src={product.image} alt={product.name} className="desc-product-img" />
        <div className={`product-desc-text${showFullDesc ? ' expanded' : ''}`}>{productDescription}</div>
        <div className="desc-btn-row">
          {!showFullDesc && (
            <button className="desc-expand-btn" onClick={()=>setShowFullDesc(true)}>Xem thêm</button>
          )}
          {showFullDesc && (
            <button className="desc-expand-btn" onClick={()=>setShowFullDesc(false)}>Thu gọn</button>
          )}
        </div>
      </div>
      {/* Gợi ý sản phẩm*/}
      <div className="suggested-products-block">
        <h2 className="suggested-title">Sản phẩm gợi ý</h2>
        <div className="suggested-slider-wrap">
          <button className="slider-arrow left" onClick={handleScrollLeft} aria-label="Trước">
            &#8592;
          </button>
          <div className="suggested-list slider" ref={sliderRef}>
            {suggested.map(item => (
              <Link to={`/product/${item.id}`} key={item.id} className="suggested-item">
                <div className="suggested-img-wrap">
                  <img src={item.image} alt={item.name} className="suggested-img" />
                </div>
                <div className="suggested-name">{item.name}</div>
                <div className="suggested-price">{item.price.toLocaleString()} đ</div>
              </Link>
            ))}
          </div>
          <button className="slider-arrow right" onClick={handleScrollRight} aria-label="Sau">
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 