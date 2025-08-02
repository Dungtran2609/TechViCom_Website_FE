const API_BASE_URL = 'http://127.0.0.1:8000';

// SỬA LẠI HÀM NÀY
const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMessage = 'Lỗi API';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Bỏ qua lỗi parse JSON nếu response lỗi cũng không có body
    }
    throw new Error(errorMessage);
  }

  // Nếu status là 204 No Content, hoặc không có body, trả về null
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType || !contentType.includes('application/json')) {
    return null; // Hoặc trả về một giá trị mặc định hợp lý
  }

  return response.json(); // Chỉ parse JSON nếu có nội dung
};

export const userAPI = {
  login: async (email, password) => {
    await fetchJson(`${API_BASE_URL}/sanctum/csrf-cookie`, { credentials: 'include' });

    return fetchJson(`${API_BASE_URL}/api/v1/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(data => data.user || data);
  },

  register: async (name, email, password, password_confirmation) => {
    await fetchJson(`${API_BASE_URL}/sanctum/csrf-cookie`, { credentials: 'include' });

    return fetchJson(`${API_BASE_URL}/api/v1/register`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    }).then(data => data.user || data);
  },

  logout: async () => {
    return fetchJson(`${API_BASE_URL}/api/v1/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then(data => data.message);
  },

  getMe: async () => {
    return fetchJson(`${API_BASE_URL}/api/v1/me`, {
      credentials: 'include',
    }).then(data => data.user || data);
  },

  updateUser: async (userId, updateData) => {
    return fetchJson(`${API_BASE_URL}/api/v1/users/${userId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
  },
};
