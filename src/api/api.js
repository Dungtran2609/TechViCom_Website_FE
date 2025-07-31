import apiClient from './client.js';

// ===== USER API =====
export const userAPI = {
  // Đăng nhập
  login: async (phone, password) => {
    try {
      const response = await apiClient.get('/users');
      const users = Array.isArray(response) ? response : [response];
      const user = users.find(u => u.phone === phone && u.password === password);
      
      if (!user) {
        throw new Error('Sai tài khoản hoặc mật khẩu');
      }
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  // Lấy thông tin user
  getUser: async (id) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Cập nhật thông tin user
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.patch(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Xóa user
  deleteUser: async (id) => {
    try {
      return apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  // Lấy tất cả users
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/users', params);
      return response;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },

  // Kiểm tra thông tin user có đầy đủ không
  checkUserMissingInfo: (user) => {
    if (!user) return true;
    if (!user.name || !user.birthday || !user.gender || !user.avatar) return true;
    if (!user.addresses || user.addresses.length === 0 || !user.addresses[0].address) return true;
    return false;
  }
};

// ===== PRODUCT API =====
export const productAPI = {
  // Lấy tất cả sản phẩm
  getProducts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/products', filters);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  // Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.patch(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  },

  // Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      return apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (query, filters = {}) => {
    try {
      const response = await apiClient.get('/products', { 
        q: query,
        ...filters 
      });
      return response;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (category, filters = {}) => {
    try {
      const response = await apiClient.get('/products', { 
        category,
        ...filters 
      });
      return response;
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get('/products', { 
        featured: true,
        _limit: limit 
      });
      return response;
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get('/products', { 
        _sort: 'createdAt',
        _order: 'desc',
        _limit: limit 
      });
      return response;
    } catch (error) {
      console.error('Get latest products error:', error);
      throw error;
    }
  }
};

// ===== ORDER API =====
export const orderAPI = {
  // Lấy đơn hàng của user
  getUserOrders: async (userId) => {
    try {
      const response = await apiClient.get('/orders', { userId });
      return response;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}`, { status });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (userId, status) => {
    try {
      const response = await apiClient.get('/orders', { userId, status });
      return response;
    } catch (error) {
      console.error('Get orders by status error:', error);
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId) => {
    try {
      return apiClient.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  }
};

// ===== VOUCHER API =====
export const voucherAPI = {
  // Validate voucher
  validateVoucher: async (code, totalAmount = 0) => {
    try {
      const response = await apiClient.get('/vouchers', { code });
      const vouchers = Array.isArray(response) ? response : [response];
      const voucher = vouchers.find(v => v.code === code);
      
      if (!voucher) {
        return {
          valid: false,
          message: 'Mã voucher không tồn tại'
        };
      }
      
      // Kiểm tra voucher có hợp lệ không
      const now = new Date();
      const startDate = new Date(voucher.startDate);
      const endDate = new Date(voucher.endDate);
      
      if (now < startDate) {
        return {
          valid: false,
          message: 'Voucher chưa có hiệu lực'
        };
      }
      
      if (now > endDate) {
        return {
          valid: false,
          message: 'Voucher đã hết hạn'
        };
      }
      
      if (voucher.usedCount >= voucher.usageLimit) {
        return {
          valid: false,
          message: 'Voucher đã hết lượt sử dụng'
        };
      }
      
      // Kiểm tra giá trị đơn hàng tối thiểu
      if (totalAmount < voucher.minOrderValue) {
        return {
          valid: false,
          message: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để sử dụng voucher này`
        };
      }
      
      return {
        valid: true,
        voucher: voucher,
        message: 'Voucher hợp lệ'
      };
    } catch (error) {
      console.error('Validate voucher error:', error);
      return {
        valid: false,
        message: 'Có lỗi xảy ra khi kiểm tra voucher'
      };
    }
  },

  // Lấy voucher theo code
  getVoucherByCode: async (code) => {
    try {
      const response = await apiClient.get('/vouchers', { code });
      return Array.isArray(response) ? response[0] : response;
    } catch (error) {
      console.error('Get voucher by code error:', error);
      throw error;
    }
  },

  // Lấy tất cả voucher
  getAllVouchers: async (params = {}) => {
    try {
      const response = await apiClient.get('/vouchers', params);
      return response;
    } catch (error) {
      console.error('Get all vouchers error:', error);
      throw error;
    }
  },

  // Tạo voucher mới
  createVoucher: async (voucherData) => {
    try {
      const response = await apiClient.post('/vouchers', voucherData);
      return response;
    } catch (error) {
      console.error('Create voucher error:', error);
      throw error;
    }
  },

  // Cập nhật voucher
  updateVoucher: async (id, voucherData) => {
    try {
      const response = await apiClient.patch(`/vouchers/${id}`, voucherData);
      return response;
    } catch (error) {
      console.error('Update voucher error:', error);
      throw error;
    }
  },

  // Xóa voucher
  deleteVoucher: async (id) => {
    try {
      return apiClient.delete(`/vouchers/${id}`);
    } catch (error) {
      console.error('Delete voucher error:', error);
      throw error;
    }
  }
};

// ===== NEWS API =====
export const newsAPI = {
  // Lấy tất cả tin tức
  getNews: async (params = {}) => {
    try {
      const response = await apiClient.get('/news', params);
      return response;
    } catch (error) {
      console.error('Get news error:', error);
      throw error;
    }
  },

  // Lấy tin tức theo ID
  getNewsById: async (id) => {
    try {
      const response = await apiClient.get(`/news/${id}`);
      return response;
    } catch (error) {
      console.error('Get news by ID error:', error);
      throw error;
    }
  },

  // Lấy tin tức nổi bật
  getFeaturedNews: async (limit = 3) => {
    try {
      const response = await apiClient.get('/news', { 
        featured: true,
        _limit: limit 
      });
      return response;
    } catch (error) {
      console.error('Get featured news error:', error);
      throw error;
    }
  },

  // Tạo tin tức mới
  createNews: async (newsData) => {
    try {
      const response = await apiClient.post('/news', newsData);
      return response;
    } catch (error) {
      console.error('Create news error:', error);
      throw error;
    }
  },

  // Cập nhật tin tức
  updateNews: async (id, newsData) => {
    try {
      const response = await apiClient.patch(`/news/${id}`, newsData);
      return response;
    } catch (error) {
      console.error('Update news error:', error);
      throw error;
    }
  },

  // Xóa tin tức
  deleteNews: async (id) => {
    try {
      return apiClient.delete(`/news/${id}`);
    } catch (error) {
      console.error('Delete news error:', error);
      throw error;
    }
  }
};

// ===== CATEGORY API =====
export const categoryAPI = {
  // Lấy tất cả danh mục
  getCategories: async (params = {}) => {
    try {
      const response = await apiClient.get('/categories', params);
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error('Get category by ID error:', error);
      throw error;
    }
  },

  // Tạo danh mục mới
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response;
    } catch (error) {
      console.error('Create category error:', error);
      throw error;
    }
  },

  // Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.patch(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      console.error('Update category error:', error);
      throw error;
    }
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    try {
      return apiClient.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Delete category error:', error);
      throw error;
    }
  }
};

// ===== BANNER API =====
export const bannerAPI = {
  // Lấy tất cả banner
  getBanners: async (params = {}) => {
    try {
      const response = await apiClient.get('/banners', params);
      return response;
    } catch (error) {
      console.error('Get banners error:', error);
      throw error;
    }
  },

  // Lấy banner theo ID
  getBannerById: async (id) => {
    try {
      const response = await apiClient.get(`/banners/${id}`);
      return response;
    } catch (error) {
      console.error('Get banner by ID error:', error);
      throw error;
    }
  },

  // Tạo banner mới
  createBanner: async (bannerData) => {
    try {
      const response = await apiClient.post('/banners', bannerData);
      return response;
    } catch (error) {
      console.error('Create banner error:', error);
      throw error;
    }
  },

  // Cập nhật banner
  updateBanner: async (id, bannerData) => {
    try {
      const response = await apiClient.patch(`/banners/${id}`, bannerData);
      return response;
    } catch (error) {
      console.error('Update banner error:', error);
      throw error;
    }
  },

  // Xóa banner
  deleteBanner: async (id) => {
    try {
      return apiClient.delete(`/banners/${id}`);
    } catch (error) {
      console.error('Delete banner error:', error);
      throw error;
    }
  }
}; 

// ===== TOUCH GESTURES API =====
export const touchAPI = {
  // Theo dõi cử chỉ vuốt
  trackSwipe: async (direction, page, element) => {
    try {
      const swipeData = {
        direction, // 'left', 'right', 'up', 'down'
        page, // trang hiện tại
        element, // phần tử được vuốt
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      };
      
      // Gửi dữ liệu cử chỉ lên server (nếu có)
      // await apiClient.post('/analytics/swipes', swipeData);
      
      console.log('Swipe tracked:', swipeData);
      return swipeData;
    } catch (error) {
      console.error('Track swipe error:', error);
      return null;
    }
  },

  // Theo dõi chạm
  trackTap: async (element, page) => {
    try {
      const tapData = {
        element,
        page,
        timestamp: new Date().toISOString(),
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      };
      
      // Gửi dữ liệu chạm lên server
      // await apiClient.post('/analytics/taps', tapData);
      
      console.log('Tap tracked:', tapData);
      return tapData;
    } catch (error) {
      console.error('Track tap error:', error);
      return null;
    }
  },

  // Theo dõi chạm dài
  trackLongPress: async (element, page, duration) => {
    try {
      const longPressData = {
        element,
        page,
        duration, // thời gian giữ (ms)
        timestamp: new Date().toISOString(),
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      };
      
      // Gửi dữ liệu chạm dài lên server
      // await apiClient.post('/analytics/long-press', longPressData);
      
      console.log('Long press tracked:', longPressData);
      return longPressData;
    } catch (error) {
      console.error('Track long press error:', error);
      return null;
    }
  },

  // Kiểm tra thiết bị di động
  isMobileDevice: () => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Lấy thông tin màn hình
  getScreenInfo: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: window.devicePixelRatio,
      orientation: window.screen.orientation?.type || 'unknown'
    };
  },

  // Tối ưu hình ảnh cho thiết bị
  getOptimizedImageUrl: (originalUrl, width = null) => {
    try {
      const screenInfo = touchAPI.getScreenInfo();
      const isMobile = touchAPI.isMobileDevice();
      
      // Nếu không chỉ định width, tự động tính
      if (!width) {
        if (isMobile) {
          width = Math.min(screenInfo.width, 400); // Tối đa 400px cho mobile
        } else {
          width = Math.min(screenInfo.width, 800); // Tối đa 800px cho desktop
        }
      }

      // Tạo URL hình ảnh tối ưu
      // Giả sử backend hỗ trợ resize qua query params
      const optimizedUrl = `${originalUrl}?w=${width}&q=80&format=webp`;
      
      return {
        url: optimizedUrl,
        width: width,
        isMobile: isMobile,
        screenInfo: screenInfo
      };
    } catch (error) {
      console.error('Get optimized image error:', error);
      return { url: originalUrl, width: null, isMobile: false };
    }
  },

  // Lazy loading cho hình ảnh
  setupLazyLoading: (imageElements) => {
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      imageElements.forEach(img => {
        observer.observe(img);
      });

      return observer;
    } catch (error) {
      console.error('Setup lazy loading error:', error);
      return null;
    }
  },

  // Tạo nút thân thiện với chạm
  createTouchFriendlyButton: (config) => {
    try {
      const {
        text,
        onClick,
        className = '',
        size = 'medium', // 'small', 'medium', 'large'
        disabled = false
      } = config;

      const isMobile = touchAPI.isMobileDevice();
      const screenInfo = touchAPI.getScreenInfo();

      // Kích thước nút theo thiết bị
      const buttonSizes = {
        small: isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm',
        medium: isMobile ? 'px-4 py-3 text-base' : 'px-6 py-3 text-base',
        large: isMobile ? 'px-6 py-4 text-lg' : 'px-8 py-4 text-lg'
      };

      // Khoảng cách tối thiểu giữa các nút (44px theo Apple guidelines)
      const minTouchTarget = 'min-h-[44px] min-w-[44px]';

      const buttonClasses = `
        ${buttonSizes[size]}
        ${minTouchTarget}
        ${className}
        ${isMobile ? 'touch-manipulation' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500
      `.trim();

      return {
        className: buttonClasses,
        isMobile: isMobile,
        screenInfo: screenInfo,
        minTouchTarget: '44px'
      };
    } catch (error) {
      console.error('Create touch friendly button error:', error);
      return {
        className: 'px-4 py-2 text-base cursor-pointer',
        isMobile: false,
        screenInfo: null,
        minTouchTarget: '44px'
      };
    }
  },

  // Kiểm tra khoảng cách chạm
  validateTouchTarget: (element) => {
    try {
      const rect = element.getBoundingClientRect();
      const isMobile = touchAPI.isMobileDevice();
      
      const minSize = 44; // Apple's minimum touch target size
      const isLargeEnough = rect.width >= minSize && rect.height >= minSize;
      
      return {
        isValid: isLargeEnough,
        width: rect.width,
        height: rect.height,
        minRequired: minSize,
        isMobile: isMobile,
        recommendations: isLargeEnough ? [] : [
          'Tăng kích thước nút lên ít nhất 44px',
          'Thêm padding để tăng vùng chạm',
          'Sử dụng min-height và min-width'
        ]
      };
    } catch (error) {
      console.error('Validate touch target error:', error);
      return { isValid: false, recommendations: ['Không thể kiểm tra phần tử'] };
    }
  },

  // Tạo điều hướng điện thoại
  createMobileNavigation: (config) => {
    try {
      const {
        items = [],
        position = 'bottom', // 'bottom', 'top', 'left', 'right'
        showLabels = true,
        activeIndex = 0
      } = config;

      const isMobile = touchAPI.isMobileDevice();
      const screenInfo = touchAPI.getScreenInfo();

      // Thiết kế điều hướng theo vị trí
      const navigationStyles = {
        bottom: 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200',
        top: 'fixed top-0 left-0 right-0 bg-white border-b border-gray-200',
        left: 'fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200',
        right: 'fixed right-0 top-0 bottom-0 bg-white border-l border-gray-200'
      };

      const containerClass = navigationStyles[position] || navigationStyles.bottom;
      const isHorizontal = position === 'bottom' || position === 'top';

      return {
        containerClass,
        isHorizontal,
        isMobile,
        screenInfo,
        items: items.map((item, index) => ({
          ...item,
          isActive: index === activeIndex,
          touchTarget: 'min-h-[44px] min-w-[44px]'
        })),
        showLabels,
        position
      };
    } catch (error) {
      console.error('Create mobile navigation error:', error);
      return {
        containerClass: 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200',
        isHorizontal: true,
        isMobile: false,
        items: [],
        showLabels: true,
        position: 'bottom'
      };
    }
  },

  // Theo dõi điều hướng
  trackNavigation: async (fromPage, toPage, method) => {
    try {
      const navigationData = {
        fromPage,
        toPage,
        method, // 'tap', 'swipe', 'back', 'forward'
        timestamp: new Date().toISOString(),
        isMobile: touchAPI.isMobileDevice(),
        screenInfo: touchAPI.getScreenInfo()
      };

      // Gửi dữ liệu điều hướng lên server
      // await apiClient.post('/analytics/navigation', navigationData);

      console.log('Navigation tracked:', navigationData);
      return navigationData;
    } catch (error) {
      console.error('Track navigation error:', error);
      return null;
    }
  },

  // Kiểm tra hiệu suất điều hướng
  measureNavigationPerformance: () => {
    try {
      const startTime = performance.now();
      
      return {
        startTime,
        measureEnd: () => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          return {
            duration: `${duration.toFixed(2)}ms`,
            isFast: duration < 100,
            isMedium: duration >= 100 && duration < 300,
            isSlow: duration >= 300
          };
        }
      };
    } catch (error) {
      console.error('Measure navigation performance error:', error);
      return { startTime: 0, measureEnd: () => ({ duration: '0ms', isFast: true }) };
    }
  }
}; 