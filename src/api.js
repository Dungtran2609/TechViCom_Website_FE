// API cho user và orders sử dụng json-server
const API_URL = 'http://localhost:3001';

// --- USER ---
export async function getUser(id = 1) {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error('Không lấy được thông tin user');
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Cập nhật thông tin thất bại');
  return res.json();
}

export async function loginUser(phone, password) {
  const res = await fetch(`${API_URL}/users?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`);
  if (!res.ok) throw new Error('Lỗi đăng nhập');
  return res.json();
}

export async function registerUser(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Lỗi đăng ký');
  return res.json();
}

export function checkUserMissingInfo(user) {
  if (!user) return true;
  if (!user.name || !user.birthday || !user.gender || !user.avatar) return true;
  if (!user.addresses || user.addresses.length === 0 || !user.addresses[0].address) return true;
  return false;
}

// --- ORDERS ---
export async function getOrders(userId = 1) {
  const res = await fetch(`${API_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error('Không lấy được lịch sử mua hàng');
  return res.json();
}

// --- PRODUCTS ---
export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/products${query ? '?' + query : ''}`);
  if (!res.ok) throw new Error('Không lấy được danh sách sản phẩm');
  return res.json();
}

export async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Không lấy được sản phẩm');
  return res.json();
}

// --- CATEGORIES ---
export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Không lấy được danh mục');
  return res.json();
}

// --- NEWS ---
export async function getNews(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/news${query ? '?' + query : ''}`);
  if (!res.ok) throw new Error('Không lấy được tin tức');
  return res.json();
}

export async function getNewsById(id) {
  const res = await fetch(`${API_URL}/news/${id}`);
  if (!res.ok) throw new Error('Không lấy được bài viết');
  return res.json();
}

// --- BANNERS ---
export async function getBanners() {
  const res = await fetch(`${API_URL}/banners`);
  if (!res.ok) throw new Error('Không lấy được banner');
  return res.json();
}