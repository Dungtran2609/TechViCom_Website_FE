// apiConfig.js

// Cấu hình API chung
export const API_CONFIG = {
  // Base URLs cho các môi trường khác nhau
  BASE_URLS: {
    development: 'http://localhost:3001',
    staging: 'https://api-staging.techvicom.com',
    production: 'https://api.techvicom.com',
  },

  // Lấy base URL theo biến môi trường (dùng Vite)
  getBaseURL: () => {
    const env = import.meta?.env?.VITE_API_ENV || 'development';
    return API_CONFIG.BASE_URLS[env] || API_CONFIG.BASE_URLS.development;
  },

  // Timeout cho request (ms)
  TIMEOUT: 10000, // 10 giây

  // Headers mặc định
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Cấu hình retry
  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 giây
  },

  // Cấu hình cache
  CACHE_CONFIG: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 phút
  },
};

// Helper tạo URL API, đảm bảo có dấu '/' đúng
export const createApiUrl = (endpoint) => {
  const baseURL = API_CONFIG.getBaseURL();
  return `${baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
};

// Lấy token auth từ localStorage với try-catch phòng lỗi
export const getAuthToken = () => {
  try {
    return localStorage.getItem('authToken');
  } catch (error) {
    console.warn('Không lấy được token từ localStorage:', error);
    return null;
  }
};

// Lưu hoặc xoá token auth trong localStorage với try-catch
export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  } catch (error) {
    console.warn('Không thể lưu token vào localStorage:', error);
  }
};
