// API Client đơn giản
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // ✅ BƯỚC 2: GHÉP LẠI BASE_URL VÀO ĐẦU ENDPOINT
    const url = `${this.baseURL}${endpoint}`;

    // Phần logic còn lại giữ nguyên
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      if (response.status === 204) return null;
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', url, error);
      throw error;
    }
  }

  // Các hàm get, post, patch, delete không cần sửa
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();