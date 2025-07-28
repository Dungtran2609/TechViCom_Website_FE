# Notification System Documentation

## 🎯 Tổng quan

Hệ thống thông báo hoàn chỉnh với các tính năng:
- ✅ Notification Bell với badge count
- ✅ Notification Panel với danh sách thông báo
- ✅ Toast notifications
- ✅ 4 loại thông báo: Success, Error, Warning, Info
- ✅ Auto-dismiss với timeout
- ✅ Responsive design
- ✅ Keyboard navigation
- ✅ Smooth animations

## 🚀 Cách sử dụng

### 1. Import và sử dụng cơ bản

```javascript
import { useNotifications } from '../components/NotificationSystem';

const MyComponent = () => {
  const { success, error, warning, info } = useNotifications();

  const handleSuccess = () => {
    success('Thao tác thành công!', 'Thành công');
  };

  const handleError = () => {
    error('Có lỗi xảy ra!', 'Lỗi');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Test Success</button>
      <button onClick={handleError}>Test Error</button>
    </div>
  );
};
```

### 2. Các loại thông báo

```javascript
const { success, error, warning, info } = useNotifications();

// Success notification
success('Đăng ký thành công!', 'Thành công');

// Error notification
error('Không thể kết nối server!', 'Lỗi kết nối');

// Warning notification
warning('Sản phẩm sắp hết hàng!', 'Cảnh báo');

// Info notification
info('Có 5 sản phẩm mới!', 'Thông tin mới');
```

### 3. Tùy chỉnh thông báo

```javascript
const { addNotification } = useNotifications();

// Tùy chỉnh hoàn toàn
addNotification({
  type: 'success',
  title: 'Tùy chỉnh',
  message: 'Thông báo tùy chỉnh',
  duration: 10000, // 10 giây
  showAsToast: true // Hiển thị như toast
});
```

### 4. Các options có sẵn

```javascript
addNotification({
  type: 'success' | 'error' | 'warning' | 'info',
  title: 'Tiêu đề',
  message: 'Nội dung thông báo',
  duration: 5000, // Tự động đóng sau 5s (0 = không tự đóng)
  showAsToast: false, // Hiển thị như toast notification
  read: false // Đánh dấu đã đọc
});
```

## 🎨 UI Components

### Notification Bell
- Vị trí: Góc trên bên phải
- Badge count: Hiển thị số thông báo chưa đọc
- Hover effects: Scale và shadow
- Click để mở panel

### Notification Panel
- Danh sách tất cả thông báo
- Phân loại theo type với màu sắc
- Nút "Xóa tất cả"
- Scroll khi có nhiều thông báo
- Responsive design

### Toast Notifications
- Hiển thị tạm thời ở góc trên bên phải
- Auto-dismiss
- Stack multiple toasts
- Smooth animations

## 🎯 Tích hợp vào các components

### LoginPage
```javascript
const { success, error } = useNotifications();

// Khi đăng nhập thành công
success('Đăng nhập thành công! Chào mừng bạn trở lại.', 'Đăng nhập thành công');

// Khi có lỗi
error('Sai tài khoản hoặc mật khẩu! Vui lòng kiểm tra lại.', 'Đăng nhập thất bại');
```

### CheckoutPage
```javascript
const { success, error, warning } = useNotifications();

// Khi đặt hàng thành công
success('Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm nhất.', 'Đặt hàng thành công');

// Khi voucher không hợp lệ
warning('Mã voucher không hợp lệ hoặc đã hết hạn.', 'Voucher không hợp lệ');

// Khi có lỗi
error('Không thể đặt hàng. Vui lòng thử lại sau.', 'Lỗi đặt hàng');
```

### ProductDetailPage
```javascript
const { success, info } = useNotifications();

// Khi thêm vào giỏ hàng
success('Đã thêm sản phẩm vào giỏ hàng!', 'Thêm vào giỏ hàng');

// Khi sản phẩm sắp hết hàng
info('Chỉ còn 2 sản phẩm trong kho!', 'Thông tin kho hàng');
```

## 🎨 Styling

### CSS Classes có sẵn
- `.animate-slide-in`: Animation slide in
- `.animate-fade-in`: Animation fade in
- `.animate-bounce`: Animation bounce
- `.notification-bell-pulse`: Pulse animation cho bell

### Custom animations
```css
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

## 🔧 Configuration

### Thay đổi vị trí
```javascript
// Trong NotificationBell component
<div className="fixed top-4 right-4 z-50">
  {/* Thay đổi top-4 right-4 để di chuyển */}
</div>
```

### Thay đổi timeout mặc định
```javascript
// Trong NotificationProvider
const newNotification = {
  duration: 5000, // Thay đổi timeout mặc định
  // ...
};
```

### Thay đổi màu sắc
```javascript
// Trong NotificationPanel
const getBorderColor = (type) => {
  switch (type) {
    case 'success': return 'border-l-green-500';
    case 'error': return 'border-l-red-500';
    case 'warning': return 'border-l-yellow-500';
    default: return 'border-l-blue-500';
  }
};
```

## 📱 Responsive Design

- **Desktop**: Panel rộng 320px, toast rộng 320px
- **Mobile**: Panel và toast chiếm 90% width
- **Tablet**: Tự động điều chỉnh

## ♿ Accessibility

- **Keyboard navigation**: Arrow keys, Home, End
- **Screen readers**: Proper ARIA labels
- **Focus management**: Tự động focus vào panel
- **Color contrast**: Đảm bảo contrast ratio

## 🚀 Best Practices

1. **Sử dụng đúng loại thông báo**:
   - `success`: Khi thao tác thành công
   - `error`: Khi có lỗi xảy ra
   - `warning`: Khi cần cảnh báo
   - `info`: Khi cung cấp thông tin

2. **Nội dung ngắn gọn**:
   - Title: 1-3 từ
   - Message: 1-2 câu

3. **Timeout hợp lý**:
   - Success: 3-5 giây
   - Error: 5-7 giây
   - Warning: 4-6 giây
   - Info: 3-5 giây

4. **Không spam**:
   - Tránh hiển thị quá nhiều thông báo cùng lúc
   - Sử dụng debounce cho các thao tác lặp lại

## 🔄 Migration từ Toast cũ

```javascript
// Cũ
import Toast from '../components/Toast';
// Sử dụng localStorage để hiển thị toast

// Mới
import { useNotifications } from '../components/NotificationSystem';
const { success, error } = useNotifications();
// Gọi trực tiếp function
```

## 🎯 Lợi ích

- ✅ **Centralized**: Quản lý tập trung
- ✅ **Consistent**: UI nhất quán
- ✅ **Flexible**: Dễ tùy chỉnh
- ✅ **Accessible**: Hỗ trợ accessibility
- ✅ **Responsive**: Tương thích mọi thiết bị
- ✅ **Performance**: Tối ưu hiệu suất 