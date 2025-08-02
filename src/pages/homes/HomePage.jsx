import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { BsLightning } from 'react-icons/bs';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './HomePage.css';
import Toast from '../../components/Toast';
import CouponDisplay from '../../components/CouponDisplay';
import CategoriesGrid from '../../components/CategoriesGrid';

import { useHomeCategories } from '../../hooks/useCategories';
import { bannerAPI, productAPI, newsAPI, couponAPI } from '../../api';
import { ProductGridSkeleton, CategoryGridSkeleton } from '../../components/LoadingSkeletons';
import { FadeIn, StaggerContainer, StaggerItem } from '../../components/Animations';

const HomePage = () => {
  // Fetch coupons
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  useEffect(() => {
    const loadCoupons = async () => {
      try {
        const data = await couponAPI.getCoupons();
        setCoupons(Array.isArray(data) ? data : []);
      } catch (error) {
        setCoupons([]);
      } finally {
        setLoadingCoupons(false);
      }
    };
    loadCoupons();
  }, []);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const { categories: rawCategories, loading: loadingCategories, error: categoriesError } = useHomeCategories();
  // Debug xem dữ liệu categories thực tế là gì
  // console.log('rawCategories from useHomeCategories:', rawCategories);
  // Đảm bảo categories luôn là mảng
  const categories = Array.isArray(rawCategories) ? rawCategories : [];

  // Fetch banners
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await bannerAPI.getBanners();
        setBanners(response.data || []);
      } catch (error) {
        console.error('Error loading banners:', error);
        setBanners([]);
        setBanners([]);
      }
    };
    loadBanners();
  }, []);

  // Fetch products - CHỈ GIỮ LẠI 1 useEffect cho products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productAPI.getProducts();
        // Đảm bảo luôn là mảng (nếu là Laravel paginate thì data.data là mảng)
        const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        setProducts(arr);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Ví dụ filter sản phẩm nổi bật, flash sale từ products nếu có flag
  const featuredProducts = products.filter(p => p.isFeatured && p.category === 'dien-thoai').slice(0, 5);
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 8);

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

  // Fetch bài viết nổi bật từ API - KHỞI TẠO VỚI MẢNG RỖNG
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  useEffect(() => {
    const loadNews = async () => {
      try {
        console.log('Fetching featured news...');
        const response = await newsAPI.getFeaturedNews(3);
        console.log('News API response:', response);
        // API trả về {success: true, data: [...]}
        const newsData = response.data || [];
        // Chỉ lấy 3 bài viết đầu tiên
        setNews(newsData.slice(0, 3));
        console.log('Set news data:', newsData.slice(0, 3));
      } catch (error) {
        console.error('Error loading news:', error);
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    };
    loadNews();
  }, []);
  
  // SỬA LỖI TẠI ĐÂY - Đảm bảo featuredNews luôn là array
  const featuredNews = Array.isArray(news) ? news : [];

  // Force banner autoplay when component mounts
  useEffect(() => {
    if (bannerLoaded && banners.length > 0) {
      const timer = setTimeout(() => {
        const swiperElement = document.querySelector('.banner-slider');
        if (swiperElement && swiperElement.swiper && swiperElement.swiper.autoplay) {
          swiperElement.swiper.autoplay.start();

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

              setBannerLoaded(true);
              // Force autoplay to start
              setTimeout(() => {
                if (swiper.autoplay) {
                  swiper.autoplay.start();

                }
              }, 100);
            }}
            onSlideChange={() => {
              // Handle slide change
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
                        {banner.features && Array.isArray(banner.features) && banner.features.map((feature, index) => (
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
        <CategoriesGrid
          categories={categories}
          loading={loadingCategories}
          error={categoriesError}
        />
      </section>

  {/* Sản phẩm mới nhất */}
  <section className="products-section center-section">
    <h2 className="section-title">Sản phẩm mới nhất</h2>
    <div className="products-grid">
      {loadingProducts ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Không có sản phẩm nào.</div>
      ) : (
        products.slice(0, 8).map(product => {
          // Chuẩn hóa lấy ảnh và giá như ProductListPage
          const img = product.thumbnail
            ? (product.thumbnail.startsWith('http')
                ? product.thumbnail
                : `http://localhost:8000/storage/${product.thumbnail.replace(/^storage[\\/]/, '')}`)
            : '/images/no-image.png';
          let minPrice, maxPrice;
          if (Array.isArray(product.variants) && product.variants.length > 0) {
            const prices = product.variants.map(v => {
              let price = v.sale_price !== undefined && v.sale_price !== null && v.sale_price !== '' ? Number(v.sale_price) : Number(v.price);
              return price >= 1000 ? price : null;
            }).filter(p => p !== null && !isNaN(p));
            if (prices.length > 0) {
              minPrice = Math.min(...prices);
              maxPrice = Math.max(...prices);
            }
          }
          return (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card-modern">
              <div className="product-image-modern">
                <img src={img} alt={product.name} />
              </div>
              <div className="product-info-modern">
                <h3 className="product-name-modern">{product.name}</h3>
                <div className="product-price-modern">
                  {minPrice !== undefined && maxPrice !== undefined ? (
                    <span className="current-price-modern">Giá từ {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ</span>
                  ) : product.sale_price && Number(product.sale_price) < Number(product.price) ? (
                    <>
                      <span className="current-price-modern">{Number(product.sale_price).toLocaleString()}đ</span>
                      <span className="original-price-modern">{Number(product.price).toLocaleString()}đ</span>
                    </>
                  ) : (
                    <span className="current-price-modern">{product.price ? Number(product.price).toLocaleString() : 'Liên hệ'}đ</span>
                  )}
                </div>
                {product.promotion && (
                  <div className="promotion-text-modern">{product.promotion}</div>
                )}
                <button className="buy-btn-modern">Mua ngay</button>
              </div>
            </Link>
          );
        })
      )}
    </div>
  </section>

  {/* Danh mục nổi bật */}
  <section className="categories-highlight-section center-section">
    <h2 className="section-title">Danh mục nổi bật</h2>
    <div className="categories-grid">
      {loadingCategories ? (
        <CategoryGridSkeleton count={6} />
      ) : categories.length === 0 ? (
        <div style={{padding: 40, textAlign: 'center', width: '100%'}}>Không có danh mục nào.</div>
      ) : (
        categories.slice(0, 6).map(category => {
          const img = category.image
            ? (category.image.startsWith('http')
                ? category.image
                : `http://localhost:8000/storage/${category.image.replace(/^storage[\\/]/, '')}`)
            : '/images/no-image.png';
          return (
            <Link to={`/category/${category.slug}`} key={category.id} className="category-card-modern">
              <div className="category-image-modern">
                <img src={img} alt={category.name} />
              </div>
              <div className="category-info-modern">
                <h3 className="category-name-modern">{category.name}</h3>
              </div>
            </Link>
          );
        })
      )}
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

      {/* Coupon Section */}
      <section className="center-section">
        <CouponDisplay coupons={coupons.slice(0, 5)} loading={loadingCoupons} />
      </section>

      {/* Products Section */}
      <section className="products-section center-section">
        <h2 className="section-title">Gợi ý cho bạn</h2>
        <div className="products-grid">
          {loadingProducts ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Không có sản phẩm nào.</div>
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Không có sản phẩm nào.</div>
          ) : (
            // Hiển thị sản phẩm theo danh mục, mỗi danh mục 2 sản phẩm
            (() => {
              const categories = ['dien-thoai', 'laptop', 'may-lanh', 'tu-lanh', 'dien-gia-dung', 'may-tinh-bang', 'phu-kien', 'sim-techvicom', 'quat-dieu-hoa'];
              const suggestedProducts = [];


              categories.forEach(category => {
                const categoryProducts = products.filter(p => p.category === category).slice(0, 2);
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
      <section className="bg-gradient-to-b from-white via-orange-100 to-white py-12" style={{ background: 'linear-gradient(to bottom, white 15%, #FFD9B3 60%, white 85%)' }}>
      <section className="bg-gradient-to-b from-white via-orange-100 to-white py-12" style={{ background: 'linear-gradient(to bottom, white 15%, #FFD9B3 60%, white 85%)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-10 text-orange-600 text-center tracking-tight drop-shadow">Bài viết nổi bật</h2>

          {loadingNews ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-600">Đang tải bài viết...</p>
            </div>
          ) : featuredNews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có bài viết nổi bật.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-10">
              {featuredNews.map((news) => (
                <div
                  key={news.id}
                  className="bg-white rounded-3xl shadow-lg border border-orange-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-orange-500 hover:-translate-y-2 hover:scale-105"
                >
                  <div className="overflow-hidden">
                    <img
                      src={`http://localhost:8000/${news.image}` || '/images/news/anhbv1.jpg'}
                      alt={news.title}
                      className="h-56 w-full object-cover rounded-t-3xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                      onError={(e) => {
                        e.target.src = '/images/news/anhbv1.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300 group-hover:text-orange-600 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                      {news.content ? news.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...' : 'Không có mô tả'}
                    </p>
                    <p className="text-gray-400 text-xs mb-4 text-right">
                      {news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                    </p>
                    <Link to={`/news/${news.id}`} className="inline-flex items-center justify-center gap-2 mt-auto px-5 py-2.5 bg-orange-500 text-white rounded-full font-semibold shadow transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-300 w-full text-lg group-hover:bg-orange-600">
                      → Xem bài viết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center">
            <Link to="/news" className="px-7 py-3 bg-orange-500 text-white rounded-full font-bold shadow hover:bg-orange-600 transition-colors text-lg hover:scale-105 transform transition-transform duration-200">
              Xem tất cả bài viết
            </Link>
          </div>
        </div>
      </section>

      {/* Cooling Products Section */}
      <section className="cooling-products-section">
        <h2 className="section-title">Tận hưởng hệ mát lạnh và an toàn</h2>
        <div className="products-grid">
          {loadingProducts ? (
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Đang tải sản phẩm...</div>
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Đang tải sản phẩm...</div>
          ) : products.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Không có sản phẩm nào.</div>
            <div style={{ padding: 40, textAlign: 'center', width: '100%' }}>Không có sản phẩm nào.</div>
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
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                      <button className="cooling-buy-btn">Xem chi tiết</button>
                    </div>
                  </div>
                </Link>
              ));
            })()
          )}
        </div>
      </section>




    </div>
  );
};

export default HomePage;