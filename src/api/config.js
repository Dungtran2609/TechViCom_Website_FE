
// API Configuration
export const API_CONFIG = {
  BASE_URLS: {
    development: 'http://localhost:8000/api',
    staging: 'https://api-staging.techvicom.com',
    production: 'https://api.techvicom.com'
  },

  getBaseURL: () => {
    const env = import.meta.env.VITE_API_ENV || 'development';
    return API_CONFIG.BASE_URLS[env] || API_CONFIG.BASE_URLS.development;
  },

  TIMEOUT: 10000, // 10 seconds

  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
  },

  CACHE_CONFIG: {
    enabled: true,
    maxAge: 5 * 60 * 1000, // 5 minutes
  }
};

// Helper function để tạo API URL
export const createApiUrl = (endpoint) => {
  const baseURL = API_CONFIG.getBaseURL();
  return `${baseURL}${endpoint}`;
};

// Helper function để lấy token từ localStorage
export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

// Helper function để set token vào localStorage
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
};
