import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { BsLightning } from 'react-icons/bs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomePage.css';
import Toast from '../components/Toast';
import VoucherDisplay from '../components/VoucherDisplay';
import CategoriesGrid from '../components/CategoriesGrid';

import { useHomeCategories } from '../hooks/useCategories';
import { api } from '../api';

const HomePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { categories, loading: loadingCategories, error: categoriesError } = useHomeCategories();

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

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch banners
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    api.banner.getAll()
      .then(data => {
        console.log('Banners loaded:', data);
        setBanners(data);
      })
      .catch(error => {
        console.error('Error loading banners:', error);
      });
  }, []);

  // Fetch products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  useEffect(() => {
    api.product.getProducts()
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, []);

  // Ví dụ filter sản phẩm nổi bật, flash sale từ products nếu có flag
  const featuredProducts = products.filter(p => p.isFeatured && p.category === 'dien-thoai').slice(0, 5); // Chỉ hiển thị 5 sản phẩm điện thoại nổi bật
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 8); // Chỉ hiển thị 8 sản phẩm flash sale

  const [successMessage, setSuccessMessage] = useState('');
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [swiperKey, setSwiperKey] = useState(0);
  useEffect(() => {
    const msg = localStorage.getItem('success');
    if (msg) {
      setSuccessMessage(msg);
      localStorage.removeItem('success');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  }, []);

  // Fetch bài viết nổi bật từ API
  const [news, setNews] = useState([]);
  useEffect(() => {
    api.news.getFeatured(3)
      .then(data => setNews(data));
  }, []);
  const featuredNews = news; // Đã lấy 3 bài nổi bật từ API

  // Force banner autoplay when component mounts
  useEffect(() => {
    if (bannerLoaded && banners.length > 0) {
      const timer = setTimeout(() => {
        const swiperElement = document.querySelector('.banner-slider');
        if (swiperElement && swiperElement.swiper && swiperElement.swiper.autoplay) {
          swiperElement.swiper.autoplay.start();
          console.log('Banner autoplay started with', banners.length, 'banners');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [bannerLoaded, banners.length]);

  // Force autoplay when banners data changes
  useEffect(() => {
    if (banners.length > 0) {
      setBannerLoaded(false);
      setSwiperKey(prev => prev + 1);
      const timer = setTimeout(() => {
        const swiperElement = document.querySelector('.banner-slider');
        if (swiperElement && swiperElement.swiper && swiperElement.swiper.autoplay) {
          swiperElement.swiper.autoplay.start();
          console.log('Forcing autoplay after banners loaded');
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [banners.length]);

  return (
    <div className="home-page">
      {successMessage && (
        <Toast message={successMessage} type="success" onClose={() => setSuccessMessage("")} duration={2000} />
      )}
      {/* Banner Section */}
      <div className="banner-wrapper">
        <section className="banner-section">
                              <Swiper
            key={`banner-swiper-${swiperKey}`}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={false}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
              enabled: true,
            }}
            loop={true}
            className="banner-slider"
            onSwiper={(swiper) => {
              console.log('Swiper initialized with', banners.length, 'banners');
              console.log('Banners data:', banners);
              setBannerLoaded(true);
              // Force autoplay to start
              setTimeout(() => {
                if (swiper.autoplay) {
                  swiper.autoplay.start();
                  console.log('Autoplay started');
                }
              }, 100);
            }}
            onSlideChange={(swiper) => {
              console.log('Slide changed to', swiper.realIndex);
            }}
          >
            {banners.map((banner) => {
              // Tìm sản phẩm tương ứng từ danh sách products
              const product = products.find(p => p.id === banner.productId);
              
              return (
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
                      {product && (
                        <div className="product-info-banner">
                          <div className="product-name-banner">{product.name}</div>
                        </div>
                      )}
                      <Link to={banner.link} className="banner-button highlight-btn">
                        {banner.buttonText}
                      </Link>
                    </div>
                    <div className="banner-image">
                      <img src={product ? product.image : banner.image} alt={product ? product.name : banner.title} />
                      {product && (
                        <div className="product-overlay">
                          <div className="product-details">
                            <h3>{product.name}</h3>
                            <p className="price">{product.price.toLocaleString()}đ</p>
                            <Link to={banner.link} className="view-product-btn">
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      </div>

      {/* Categories Grid */}
      <section className="categories-section center-section">
        <CategoriesGrid 
          categories={categories} 
          loading={loadingCategories}
          error={categoriesError}
        />
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
              <button className="date-btn-modern active">Sắp diễn ra • 08/08</button>
              <button className="date-btn-modern">09/08</button>
              <button className="date-btn-modern">10/08</button>
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

      {/* Voucher Section */}
      <section className="center-section">
        <VoucherDisplay limit={5} />
      </section>

      {/* Products Section */}
      <section className="products-section center-section">
        <h2 className="section-title">Gợi ý cho bạn</h2>
        <div className="products-grid">
          {loadingProducts ? (
            <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Không có sản phẩm nào.</div>
          ) : (
            // Hiển thị sản phẩm theo danh mục, mỗi danh mục 2 sản phẩm
            (() => {
              const categories = ['dien-thoai', 'laptop', 'may-lanh', 'tu-lanh', 'dien-gia-dung', 'may-tinh-bang', 'phu-kien', 'sim-techvicom', 'quat-dieu-hoa'];
              const suggestedProducts = [];
              
              categories.forEach(category => {
                const categoryProducts = products.filter(p => p.category === category).slice(0, 2); // Lấy chính xác 2 sản phẩm mỗi danh mục
                suggestedProducts.push(...categoryProducts);
              });
              
              return suggestedProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card-modern">
                  <div className="product-image-modern">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info-modern">
                    <h3 className="product-name-modern">{product.name}</h3>
                    <div className="product-price-modern">
                      <span className="current-price-modern">{product.price.toLocaleString()}đ</span>
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <span className="original-price-modern">{product.originalPrice.toLocaleString()}đ</span>
                      )}
                    </div>
                    {product.promotion && (
                      <div className="promotion-text-modern">{product.promotion}</div>
                    )}
                    <button className="buy-btn-modern">Mua ngay</button>
                  </div>
                </Link>
              ));
            })()
          )}
        </div>
      </section>

      {/* Services Banner Section */}
      <section className="services-banner">
        <div className="services-grid">
        <Link to="/products/may-lanh" className="service-item large">
            <img src="/images/services/ac-service.jpg" alt="Mở máy lạnh hệ mát lạnh" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Mở máy lạnh<br />hệ mát lạnh</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </Link>
          <Link to="/products/dien-gia-dung" className="service-item large">
            <img src="/images/services/massage.jpg" alt="Massage tại nhà đã gì đâu" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Massage tại nhà<br />đã gì đâu</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </Link>
          <Link to="/products/quat-dieu-hoa" className="service-item">
            <img src="/images/services/air-purifier.jpg" alt="Không khí sạch khỏe mọi vui" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Không khí sạch<br />khỏe mọi vui</h3>
              <button className="service-btn">Chọn ngay</button>
            </div>
          </Link>
          <Link to="/products/dien-gia-dung" className="service-item">
            <img src="/images/services/smart-tv.jpg" alt="Giải trí cực đã với Smart TV" />
            <div className="service-content">
              <h3 className="drop-shadow-lg font-bold text-white">Giải trí cực đã<br />với Smart TV</h3>
              <button className="service-btn">Xem ngay</button>
            </div>
          </Link>
        </div>
      </section>

      {/* Recommended Products Section */}
      <section className="products-section center-section">
        <h2 className="section-title">Điện thoại nổi bật nhất</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-modern">
              <div className="product-image-modern">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info-modern">
                <h3 className="product-name-modern">{product.name}</h3>
                <div className="product-price-modern">
                  <span className="current-price-modern">{product.price.toLocaleString()}đ</span>
                  {product.originalPrice && product.originalPrice !== product.price && (
                    <span className="original-price-modern">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                </div>
                {product.promotion && (
                  <div className="promotion-text-modern">{product.promotion}</div>
                )}
                <button className="buy-btn-modern">Mua ngay</button>
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
                    src={news.thumbnail}
                    alt={news.title}
                    className="h-56 w-full object-cover rounded-t-3xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300 group-hover:text-orange-600 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{news.date}</p>
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
          {loadingProducts ? (
            <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Không có sản phẩm nào.</div>
          ) : (
            (() => {
              // Lấy 5 sản phẩm điều hòa và 5 sản phẩm quạt điều hòa
              const airConditioners = products.filter(p => p.category === 'may-lanh').slice(0, 5);
              const coolingFans = products.filter(p => p.category === 'quat-dieu-hoa').slice(0, 5);
              const coolingProducts = [...airConditioners, ...coolingFans];
              
              return coolingProducts.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {product.originalPrice && product.originalPrice !== product.price && (
                      <span className="discount-badge">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">
                      <span className="current-price">
                        {product.price.toLocaleString()}đ
                      </span>
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <span className="original-price">
                          {product.originalPrice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                    <div style={{marginTop: '12px', textAlign: 'center'}}>
                      <button className="cooling-buy-btn">Xem chi tiết</button>
                    </div>
                  </div>
                </Link>
              ));
            })()
          )}
        </div>
      </section>      
      


      {/* Scroll To Top Icon */}
      <div className={`scroll-to-top-icon ${showScrollToTop ? 'show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="scroll-to-top-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12H9V20H15V12H20L12 4Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 