// Legacy API functions - Sử dụng hệ thống API mới
// Để tương thích với code cũ, giữ lại các function này nhưng sử dụng API system mới

import { api, userService, productService, orderService, voucherService } from './api/index.js';

// User API
export async function getUser(id = 1) {
  return api.user.getUser(id);
}

export async function updateUser(id, data) {
  return api.user.updateUser(id, data);
}

export async function loginUser(phone, password) {
  return api.user.login(phone, password);
}

export async function registerUser(user) {
  return api.user.register(user);
}

export function checkUserMissingInfo(user) {
  return api.user.checkUserMissingInfo(user);
}

// Order API
export async function getOrders(userId = 1) {
  return api.order.getOrders(userId);
}

// Product API
export async function getProducts(filters = {}) {
  return api.product.getProducts(filters);
}

export async function getProductById(id) {
  return api.product.getProductById(id);
}

// Export API system để sử dụng mới
export { api, userService, productService, orderService, voucherService };