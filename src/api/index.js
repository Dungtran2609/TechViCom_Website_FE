// Export API Client
export { default as apiClient, ApiClient } from './client.js';

// Export Services
export { userService } from './services/userService.js';
export { productService } from './services/productService.js';
export { orderService } from './services/orderService.js';
export { voucherService } from './services/voucherService.js';
export { newsService } from './services/newsService.js';
export { bannerService } from './services/bannerService.js';
export { categoryService } from './services/categoryService.js';

// Export tất cả services trong một object để dễ sử dụng
import { userService } from './services/userService.js';
import { productService } from './services/productService.js';
import { orderService } from './services/orderService.js';
import { voucherService } from './services/voucherService.js';
import { newsService } from './services/newsService.js';
import { bannerService } from './services/bannerService.js';
import { categoryService } from './services/categoryService.js';

export const api = {
  user: userService,
  product: productService,
  order: orderService,
  voucher: voucherService,
  news: newsService,
  banner: bannerService,
  category: categoryService
}; 