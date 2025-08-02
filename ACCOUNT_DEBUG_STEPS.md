# Debug Steps cho Account Page

## Vấn đề hiện tại
Account page hiển thị lỗi "Không thể tải thông tin người dùng" mặc dù backend vẫn đang chạy.

## Các bước debug

### Bước 1: Kiểm tra localStorage
1. Mở Developer Tools (F12)
2. Chuyển đến tab **Application** hoặc **Storage**
3. Kiểm tra **localStorage**:
   ```javascript
   // Trong Console
   console.log('User data:', localStorage.getItem('user'));
   console.log('Access token:', localStorage.getItem('access_token'));
   ```

### Bước 2: Test API trực tiếp
1. Mở file `test-login.html` trong browser
2. Nhấn "Test Login" để đăng nhập
3. Copy access token từ kết quả
4. Mở file `test-getuser.html` trong browser
5. Paste access token vào field
6. Nhấn "Test Get User" với User ID = 13

### Bước 3: Kiểm tra Console logs
1. Mở ứng dụng React
2. Chuyển đến trang `/account`
3. Mở Console (F12)
4. Tìm các log messages:
   - "Getting current user ID from localStorage:"
   - "User ID:"
   - "Fetching user with ID:"
   - "Current access token:"
   - "User data received:"
   - "Error fetching user:"

### Bước 4: Kiểm tra Network tab
1. Mở Developer Tools
2. Chuyển đến tab **Network**
3. Refresh trang `/account`
4. Tìm request đến `/users/{id}`
5. Kiểm tra:
   - Request headers (có Authorization header không?)
   - Response status
   - Response data

## Các vấn đề có thể gặp

### 1. Không có user data trong localStorage
**Triệu chứng**: `localStorage.getItem('user')` trả về null
**Giải pháp**: Đăng nhập lại

### 2. Không có access token
**Triệu chứng**: `localStorage.getItem('access_token')` trả về null
**Giải pháp**: Đăng nhập lại

### 3. Access token hết hạn
**Triệu chứng**: API trả về 401 Unauthorized
**Giải pháp**: Đăng nhập lại

### 4. CORS error
**Triệu chứng**: Console hiển thị CORS error
**Giải pháp**: Cấu hình CORS trong backend

### 5. API endpoint sai
**Triệu chứng**: 404 Not Found
**Giải pháp**: Kiểm tra endpoint trong backend

## Test Cases

### Test Case 1: Login Flow
1. Đăng nhập với `admin@gmail.com` / `admin123`
2. Kiểm tra localStorage có user data và access token
3. Chuyển đến `/account`
4. Kiểm tra Console logs

### Test Case 2: Direct API Test
1. Sử dụng `test-login.html` để login
2. Copy access token
3. Sử dụng `test-getuser.html` để test getUser
4. So sánh kết quả với React app

### Test Case 3: Error Handling
1. Xóa access token khỏi localStorage
2. Refresh trang `/account`
3. Kiểm tra error message và Console logs

## Thông tin cần cung cấp

Khi báo lỗi, hãy cung cấp:

1. **Console logs** từ Developer Tools
2. **localStorage content**:
   ```javascript
   console.log('User:', localStorage.getItem('user'));
   console.log('Token:', localStorage.getItem('access_token'));
   ```
3. **Network tab** screenshots
4. **Test results** từ `test-getuser.html`
5. **Backend server logs** (nếu có)

## Quick Fixes

### Nếu không có user data:
```javascript
// Trong Console
localStorage.removeItem('user');
localStorage.removeItem('access_token');
// Sau đó đăng nhập lại
```

### Nếu token hết hạn:
```javascript
// Trong Console
localStorage.removeItem('access_token');
// Sau đó đăng nhập lại
```

### Nếu muốn test với user ID cụ thể:
```javascript
// Trong Console
localStorage.setItem('user', JSON.stringify({id: 13}));
// Sau đó refresh trang
```

## Next Steps

1. **Chạy test cases** theo thứ tự
2. **Cung cấp Console logs** nếu có lỗi
3. **Kiểm tra backend logs** nếu cần
4. **Test API trực tiếp** để isolate vấn đề 