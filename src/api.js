const API_URL = "http://localhost:3002";

// Đăng ký user
export const registerUser = (user) =>
  fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then(res => res.json());

// Đăng nhập user
export const loginUser = (phone, password) =>
  fetch(`${API_URL}/users?phone=${encodeURIComponent(phone)}&password=${encodeURIComponent(password)}`)
    .then(res => res.json());

// Đặt hàng
export const createOrder = (order) =>
  fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  }).then(res => res.json());

// Lấy đơn hàng theo userId
export const getOrdersByUser = (userId) =>
  fetch(`${API_URL}/orders?userId=${userId}`).then(res => res.json()); 