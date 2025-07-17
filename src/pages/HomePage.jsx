import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { BsFan, BsLightning } from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomePage.css';
import { products } from '../data/products';
import Toast from '../components/Toast';
// Categories cho HomePage (đơn giản hơn so với Header)
const categories = [
  { id: 1, name: 'Điện thoại', icon: <FaMobileAlt size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/dien-thoai' },
  { id: 2, name: 'Laptop', icon: <FaLaptop size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/laptop' },
  { id: 3, name: 'Điều hòa', icon: <MdAir size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/may-lanh' },
  { id: 4, name: 'Tủ lạnh', icon: <MdKitchen size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/tu-lanh' },
  { id: 5, name: 'Điện gia dụng', icon: <GiWashingMachine size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/dien-gia-dung' },
  { id: 6, name: 'Máy tính bảng', icon: <FaTabletAlt size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/may-tinh-bang' },
  { id: 7, name: 'Phụ kiện', icon: <FaHeadphones size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/phu-kien' },
  { id: 8, name: 'SIM Techvicom', icon: <IoPhonePortrait size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/sim-techvicom' },
  { id: 9, name: 'Quạt điều hòa', icon: <BsFan size={50} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />, path: '/quat-dieu-hoa' }
];

// Thêm đoạn này ở đầu file để lấy dữ liệu bài viết nổi bật
const featuredNews = [
  {
    id: 1,
    title: 'iPhone 16 lộ diện: Thiết kế mới, camera nâng cấp vượt trội',
    image: '/images/news/iphone16.jpg',
    description: 'Apple chuẩn bị ra mắt iPhone 16 với nhiều cải tiến về thiết kế và camera, hứa hẹn tạo nên cơn sốt mới trên thị trường smartphone.',
    link: '/news',
  },
  {
    id: 2,
    title: 'Samsung trình làng Galaxy Z Fold6 với công nghệ màn hình gập tiên tiến',
    image: '/images/news/galaxy-zfold6.jpg',
    description: 'Galaxy Z Fold6 mang đến trải nghiệm gập mở mượt mà, cấu hình mạnh mẽ và nhiều tính năng thông minh cho người dùng hiện đại.',
    link: '/news',
  },
  {
    id: 3,
    title: 'Top 5 laptop mỏng nhẹ đáng mua nhất năm 2024',
    image: '/images/news/laptop2024.jpg',
    description: 'Danh sách những mẫu laptop mỏng nhẹ, hiệu năng cao, phù hợp cho học sinh, sinh viên và dân văn phòng.',
    link: '/news',
  },
];

const HomePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 22,
    seconds: 2
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        if (newSeconds < 0) {
          const newMinutes = prevTime.minutes - 1;
          if (newMinutes < 0) {
            const newHours = prevTime.hours - 1;
            if (newHours < 0) {
              clearInterval(timer);
              return prevTime;
            }
            return { hours: newHours, minutes: 59, seconds: 59 };
          }
          return { ...prevTime, minutes: newMinutes, seconds: 59 };
        }
        return { ...prevTime, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const banners = [
    {
      id: 1,
      image: '/images/banners/banner1.jpg',
      title: 'TẬN BỪNG ĐỈNH - AI SMART',
      subtitle: 'Laptop chỉ từ 8.990.000Đ',
      features: [
        'Trả góp 0%',
        'Giảm thêm 5%',
        'Tặng SIM Techvicom 60GB/tháng'
      ],
      buttonText: 'Khám phá ngay',
      link: '/khuyen-mai'
    },
    {
      id: 2,
      image: '/images/banners/banner2.jpg',
      title: 'Đón đầu 5G - HONOR X9c',
      subtitle: 'Giảm ngay 700K',
      features: [
        'Pin 6.000 mAh',
        'Dùng thoải mái trả sau',
        'Bảo hành 2 năm'
      ],
      buttonText: 'Mua ngay',
      link: '/honor-x9c'
    },
    {
      id: 3,
      image: '/images/banners/banner3.jpg',
      title: 'DEEBOT mini',
      subtitle: 'Giá bão bán 7.990.000Đ',
      features: [
        'Small in Size Powerful in Style',
        'Công nghệ AI thông minh',
        'Thiết kế nhỏ gọn'
      ],
      buttonText: 'Tìm hiểu thêm',
      link: '/deebot-mini'
    }
  ];

  const flashSaleProducts = [
    {
      id: 1,
      name: 'Quạt tháp Fujihome TF-121HM',
      price: 899000,
      originalPrice: 3000000,
      discount: 70,
      image: '/images/products/quat-thap.jpg',
      status: 'Đã bán 0/15 suất'
    },
    {
      id: 2,
      name: 'Tai nghe Bluetooth nhét tai Defunc TRUE GO Slim',
      price: 490000,
      originalPrice: 1490000,
      discount: 67,
      image: '/images/products/tai-nghe.jpg',
      status: 'Đã bán 0/20 suất'
    },
    {
      id: 3,
      name: 'Quạt điều hòa Hoa Phát HPCF1-022 86W',
      price: 1690000,
      originalPrice: 2500000,
      discount: 40,
      image: '/images/products/quat-dieu-hoa.jpg',
      status: 'Đã bán 0/15 suất'
    },
    {
      id: 4,
      name: 'Nồi chiên không dầu Unie 6.5 lít UE-600',
      price: 1190000,
      originalPrice: 2390000,
      discount: 50,
      image: '/images/products/noi-chien.jpg',
      status: 'Đã bán 0/15 suất'
    }
  ];

  const productsFeatured = [
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
    {
      id: 6,
      name: 'Google Pixel 8 Pro',
      price: 22990000,
      originalPrice: 24990000,
      image: '/images/products/pixel-8-pro.jpg',
      installment: 'Trả góp 0%',
      storage: ['256 GB', '512 GB'],
      colors: ['black', 'blue'],
      promotion: 'Tặng đồng hồ Pixel Watch 2 trị giá 8 triệu'
    },
    {
      id: 7,
      name: 'OnePlus 12',
      price: 19990000,
      originalPrice: 21990000,
      image: '/images/products/oneplus-12.jpg',
      installment: 'Trả góp 0%',
      storage: ['256 GB', '512 GB'],
      colors: ['green', 'black'],
      promotion: 'Tặng tai nghe OnePlus Buds Pro 2'
    },
    {
      id: 8,
      name: 'Realme GT5 Pro',
      price: 16990000,
      originalPrice: 18990000,
      image: '/images/products/realme-gt5.jpg',
      installment: 'Trả góp 0%',
      storage: ['256 GB'],
      colors: ['red', 'blue'],
      promotion: 'Giảm 1.000.000đ khi thanh toán qua VNPAY'
    },
    {
      id: 9,
      name: 'Nothing Phone (2)',
      price: 15990000,
      originalPrice: 16990000,
      image: '/images/products/nothing-phone-2.jpg',
      installment: 'Trả góp 0%',
      storage: ['256 GB'],
      colors: ['white', 'black'],
      promotion: 'Tặng ốp lưng chính hãng trị giá 790.000đ'
    },
    {
      id: 10,
      name: 'Huawei P60 Pro',
      price: 24990000,
      originalPrice: 26990000,
      image: '/images/products/huawei-p60.jpg',
      installment: 'Trả góp 0%',
      storage: ['256 GB', '512 GB'],
      colors: ['black', 'purple'],
      promotion: 'Tặng Watch GT4 trị giá 6.990.000đ'
    }
  ];

  const [successMessage, setSuccessMessage] = useState('');
  useEffect(() => {
    const msg = localStorage.getItem('success');
    if (msg) {
      setSuccessMessage(msg);
      localStorage.removeItem('success');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  }, []);

  return (
    <div className="home-page">
      {successMessage && (
        <Toast message={successMessage} type="success" onClose={() => setSuccessMessage("")} duration={2000} />
      )}
      {/* Banner Section */}
      <div className="banner-wrapper">
        <section className="banner-section">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{
              clickable: true,
              renderBullet: function (index, className) {
                return `<span class="${className}"></span>`;
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="banner-slider"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="banner-content">
                  <div className="banner-text">
                    <h1>{banner.title}</h1>
                    <p className="subtitle">{banner.subtitle}</p>
                    <ul className="features">
                      {banner.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <Link to={banner.link} className="banner-button highlight-btn">
                      {banner.buttonText}
                    </Link>
                  </div>
                  <div className="banner-image">
                    <img src={banner.image} alt={banner.title} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </div>

      {/* Categories Grid */}
      <section className="categories-section center-section">
        <div className="categories-grid">
          {categories.map((category) => (
            <Link to={category.path} key={category.id} className="category-card">
              <div className="category-icon">
                {category.icon}
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="flash-sale-section center-section">
        <div className="flash-sale-header-modern">
          <div className="flash-sale-title-modern">
            <BsLightning className="flash-icon-modern" />
            <h2>DUY NHẤT 6.6 CHỚP DEAL HỜI</h2>
          </div>
          <div className="flash-sale-timer-modern">
            <div className="sale-date-modern">
              <button className="date-btn-modern active">Sắp diễn ra • 06/06</button>
              <button className="date-btn-modern">07/06</button>
              <button className="date-btn-modern">08/06</button>
            </div>
            <div className="countdown-modern">
              <span className="time-block-modern">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="separator-modern">:</span>
              <span className="time-block-modern">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="separator-modern">:</span>
              <span className="time-block-modern">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="flash-sale-products-modern">
          {flashSaleProducts.map(product => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-modern">
              <div className="product-image-modern">
                <img src={product.image} alt={product.name} />
                <span className="discount-badge-modern">-{product.discount}%</span>
              </div>
              <div className="product-info-modern">
                <h3 className="product-name-modern">{product.name}</h3>
                <div className="product-price-modern">
                  <span className="current-price-modern">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="original-price-modern">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="product-status-modern">
                  <span>{product.status}</span>
                  <button className="buy-button-modern">Sắp diễn ra</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section center-section">
        <h2 className="section-title">Gợi ý cho bạn</h2>
        <div className="products-grid">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="installment-badge">{product.installment}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  <span className="current-price">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="original-price">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div className="product-storage">
                  {product.variants.map((variant, index) => (
                    <button key={index} className="storage-option">
                      {variant.storage}
                    </button>
                  ))}
                </div>
                <div className="product-colors">
                  {product.colors.map((color, index) => (
                    <span 
                      key={index} 
                      className="color-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="product-promotion" style={{marginTop: 'auto', minHeight: '40px', display: product.promotion ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center'}}>
                  {product.promotion && (
                    <span className="promotion-text">{product.promotion}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Services Banner Section */}
      <section className="services-banner">
        <div className="services-grid">
          <div className="service-item large">
            <img src="/images/services/ac-service.jpg" alt="Mở máy lạnh hệ mát lạnh" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Mở máy lạnh<br />hệ mát lạnh</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </div>
          <div className="service-item large">
            <img src="/images/services/massage.jpg" alt="Massage tại nhà đã gì đâu" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Massage tại nhà<br />đã gì đâu</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </div>
          <div className="service-item">
            <img src="/images/services/air-purifier.jpg" alt="Không khí sạch khỏe mọi vui" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Không khí sạch<br />khỏe mọi vui</h3>
              <button className="service-btn">Chọn ngay</button>
            </div>
          </div>
          <div className="service-item">
            <img src="/images/services/smart-tv.jpg" alt="Giải trí cực đã với Smart TV" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Giải trí cực đã<br />với Smart TV</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="products-section center-section">
        <h2 className="section-title">Điện thoại nổi bật nhất</h2>
        <div className="products-grid">
          {productsFeatured.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="installment-badge">{product.installment}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="price-container">
                  <span className="current-price">{product.price.toLocaleString()}đ</span>
                  <span className="original-price">{product.originalPrice.toLocaleString()}đ</span>
                </div>
                <div className="storage-options">
                  {product.storage.map((size, index) => (
                    <span key={index} className="storage-option">{size}</span>
                  ))}
                </div>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <span 
                      key={index} 
                      className="color-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="promotion-text">
                  {product.promotion}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured News Section */}
      <section className="bg-gradient-to-b from-white via-orange-100 to-white py-12" style={{background: 'linear-gradient(to bottom, white 15%, #FFD9B3 60%, white 85%)'}}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-10 text-orange-600 text-center tracking-tight drop-shadow">Bài viết nổi bật</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
            {featuredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-3xl shadow-lg border border-orange-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-orange-500 hover:-translate-y-2 hover:scale-105"
              >
                <div className="overflow-hidden">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="h-56 w-full object-cover rounded-t-3xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300 group-hover:text-orange-600 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{news.description}</p>
                  <Link to={`/news/${news.id}`} className="inline-flex items-center justify-center gap-2 mt-auto px-5 py-2.5 bg-orange-500 text-white rounded-full font-semibold shadow transition-all duration-200 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 w-full text-lg">
                    → Xem bài viết
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <a href="/news" className="px-7 py-3 bg-orange-500 text-white rounded-full font-bold shadow hover:bg-orange-600 transition-colors text-lg">Xem tất cả bài viết</a>
          </div>
        </div>
      </section>

      {/* Cooling Products Section */}
      <section className="cooling-products-section">
        <h2 className="section-title">Tận hưởng hệ mát lạnh và an toàn</h2>
        <div className="products-grid">
          {[
            {
              id: 1,
              name: 'Máy lọc không khí Philips AC0820/20 20W',
              price: 2990000,
              originalPrice: 4000000,
              discount: 25,
              image: '/images/products/philips-ac0820.jpg'
            },
            {
              id: 2,
              name: 'Máy lạnh Samsung Inverter 1.5 HP AR13CYHZAWKNSV',
              price: 9400000,
              originalPrice: 11000000,
              discount: 15,
              image: '/images/products/samsung-ar13.jpg'
            },
            {
              id: 3,
              name: 'Tủ lạnh Casper Inverter 430 lít RM-430PB',
              price: 10900000,
              originalPrice: 13000000,
              discount: 17,
              image: '/images/products/casper-rm430.jpg'
            },
            {
              id: 4,
              name: 'Máy lọc không khí Lumina Buma Compact 25W',
              price: 1900000,
              originalPrice: 2500000,
              discount: 24,
              image: '/images/products/lumina-buma.jpg'
            },
            {
              id: 5,
              name: 'Quạt điều hòa Kangaroo KG50F54 30W',
              price: 3100000,
              originalPrice: 4000000,
              discount: 28,
              image: '/images/products/kangaroo-kg50f54.jpg'
            }
          ].map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <span className="discount-badge">-{product.discount}%</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  <span className="current-price">
                    {product.price.toLocaleString()}đ
                  </span>
                  <span className="original-price">
                    {product.originalPrice.toLocaleString()}đ
                  </span>
                </div>
                <div style={{marginTop: '12px', textAlign: 'center'}}>
                  <button className="cooling-buy-btn">Xem chi tiết</button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>      
    </div>
  );
};

export default HomePage; 