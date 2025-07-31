import apiClient from '../client.js';

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