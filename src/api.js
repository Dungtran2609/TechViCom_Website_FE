// API cho user và orders sử dụng json-server
const API_URL = 'http://localhost:3001';

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

export async function getOrders(userId = 1) {
  const res = await fetch(`${API_URL}/orders?userId=${userId}`);
  if (!res.ok) throw new Error('Không lấy được lịch sử mua hàng');
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