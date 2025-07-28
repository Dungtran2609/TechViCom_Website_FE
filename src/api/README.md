# API System Documentation

## Cách sử dụng API System

### 1. Import và sử dụng cơ bản

```javascript
// Import toàn bộ API services
import { api } from '../api';

// Hoặc import từng service riêng lẻ
import { userService, productService } from '../api';

// Hoặc import API client để tùy chỉnh
import { apiClient } from '../api';
```

### 2. Sử dụng User Service

```javascript
// Đăng nhập
const loginResult = await api.user.login('0123456789', 'password123');

// Đăng ký
const newUser = await api.user.register({
  name: 'Nguyễn Văn A',
  phone: '0123456789',
  password: 'password123',
  email: 'example@email.com'
});

// Lấy thông tin user
const user = await api.user.getUser(1);

// Cập nhật thông tin user
const updatedUser = await api.user.updateUser(1, {
  name: 'Nguyễn Văn B',
  avatar: 'new-avatar.jpg'
});
```

### 3. Sử dụng Product Service

```javascript
// Lấy tất cả sản phẩm
const products = await api.product.getProducts();

// Lấy sản phẩm với filter
const filteredProducts = await api.product.getProducts({
  category: 'phone',
  price_gte: 1000000,
  price_lte: 5000000
});

// Lấy sản phẩm theo ID
const product = await api.product.getProductById(1);

// Tìm kiếm sản phẩm
const searchResults = await api.product.searchProducts('iphone');

// Lấy sản phẩm theo danh mục
const phoneProducts = await api.product.getProductsByCategory('phone');

// Lấy sản phẩm nổi bật
const featuredProducts = await api.product.getFeaturedProducts(5);
```

### 4. Sử dụng Order Service

```javascript
// Lấy đơn hàng của user
const orders = await api.order.getOrders(1);

// Lấy đơn hàng theo trạng thái
const pendingOrders = await api.order.getOrdersByStatus(1, 'pending');

// Tạo đơn hàng mới
const newOrder = await api.order.createOrder({
  userId: 1,
  items: [
    { productId: 1, quantity: 2, price: 1000000 }
  ],
  totalAmount: 2000000,
  status: 'pending'
});

// Cập nhật trạng thái đơn hàng
await api.order.updateOrderStatus(1, 'shipped');
```

### 5. Sử dụng Voucher Service

```javascript
// Lấy danh sách voucher
const vouchers = await api.voucher.getVouchers();

// Validate voucher
const validation = await api.voucher.validateVoucher('SALE50', cartItems, 1000000);

if (validation.valid) {
  // Tính toán giảm giá
  const discount = api.voucher.calculateDiscount(validation.voucher, 1000000);
  
  // Cập nhật số lượt sử dụng
  await api.voucher.updateVoucherUsage(validation.voucher.id, validation.voucher.usedCount);
}
```

### 6. Thay đổi Base URL

```javascript
import { apiClient } from '../api';

// Thay đổi base URL cho production
apiClient.setBaseURL('https://api.techvicom.com');

// Hoặc tạo client mới với URL khác
import { ApiClient } from '../api';
const customClient = new ApiClient('https://custom-api.com');
```

### 7. Thêm Headers tùy chỉnh

```javascript
// Thêm headers mặc định
apiClient.setDefaultHeaders({
  'X-Custom-Header': 'value',
  'Authorization': 'Bearer your-token'
});
```

### 8. Xử lý lỗi

```javascript
try {
  const products = await api.product.getProducts();
} catch (error) {
  console.error('Lỗi khi lấy sản phẩm:', error.message);
  // Xử lý lỗi tại đây
}
```

## Cấu hình Environment

Tạo file `.env` trong thư mục gốc:

```env
VITE_API_ENV=development
```

Các giá trị có thể:
- `development`: http://localhost:3001
- `staging`: https://api-staging.techvicom.com  
- `production`: https://api.techvicom.com

## Lợi ích của hệ thống này

1. **Dễ dàng thay đổi API URL**: Chỉ cần thay đổi trong config
2. **Tự động xử lý lỗi**: Tất cả API calls đều có error handling
3. **Type-safe**: Các method được định nghĩa rõ ràng
4. **Dễ maintain**: Code được tổ chức theo module
5. **Flexible**: Có thể tùy chỉnh headers, timeout, retry logic
6. **Consistent**: Tất cả API calls đều có cùng format 