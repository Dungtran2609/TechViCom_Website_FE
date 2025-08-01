# Hướng dẫn Debug API Issues

## Vấn đề hiện tại
Bạn báo "không lấy được dữ liệu" sau khi cập nhật API. Dưới đây là các bước debug:

## 1. Kiểm tra Backend Server

### Bước 1: Kiểm tra xem backend có đang chạy không
```bash
# Kiểm tra xem có process nào đang chạy trên port 8000 không
netstat -an | findstr :8000

# Hoặc sử dụng PowerShell
Get-NetTCPConnection -LocalPort 8000
```

### Bước 2: Khởi động backend server (nếu chưa chạy)
```bash
# Nếu bạn có backend Laravel/PHP
cd path/to/your/backend
php artisan serve --port=8000

# Hoặc nếu dùng Docker
docker-compose up

# Hoặc nếu dùng Node.js backend
node server.js
```

## 2. Test API trực tiếp

### Sử dụng file test-login.html
1. Mở file `test-login.html` trong browser
2. Nhấn "Test Login" để kiểm tra API login
3. Kiểm tra Console (F12) để xem logs

### Sử dụng Postman
1. Mở Postman
2. Tạo request POST đến `http://localhost:8000/api/v1/login`
3. Body: `{"email": "admin@gmail.com", "password": "admin123"}`
4. Headers: `Content-Type: application/json`

## 3. Kiểm tra Frontend

### Bước 1: Mở Developer Tools
1. Mở ứng dụng React trong browser
2. Nhấn F12 để mở Developer Tools
3. Chuyển đến tab **Console**

### Bước 2: Thử đăng nhập
1. Điền email: `admin@gmail.com`
2. Điền password: `admin123`
3. Nhấn đăng nhập
4. Quan sát logs trong Console

### Bước 3: Kiểm tra Network tab
1. Chuyển đến tab **Network**
2. Thử đăng nhập lại
3. Kiểm tra request đến `/login`
4. Xem response status và data

## 4. Các lỗi thường gặp

### Lỗi CORS
```
Access to fetch at 'http://localhost:8000/api/v1/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Giải pháp**: Cấu hình CORS trong backend

### Lỗi Connection Refused
```
Failed to fetch
```
**Nguyên nhân**: Backend server không chạy
**Giải pháp**: Khởi động backend server

### Lỗi 404 Not Found
```
HTTP 404 - Not Found
```
**Nguyên nhân**: API endpoint không đúng
**Giải pháp**: Kiểm tra lại endpoint trong backend

### Lỗi 401 Unauthorized
```
HTTP 401 - Unauthorized
```
**Nguyên nhân**: Credentials không đúng
**Giải pháp**: Kiểm tra email/password

## 5. Debug Steps

### Step 1: Kiểm tra backend
```bash
# Test backend trực tiếp
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gmail.com", "password": "admin123"}'
```

### Step 2: Kiểm tra frontend logs
Mở Console và tìm các log messages:
- "Attempting login with:"
- "Login response:"
- "Access token saved"
- "Converted user data:"

### Step 3: Kiểm tra localStorage
```javascript
// Trong Console
console.log('Access token:', localStorage.getItem('access_token'));
console.log('User data:', localStorage.getItem('user'));
```

## 6. Các file đã được cập nhật

### Files đã thêm logging:
- `src/api/client.js` - Thêm console.log cho requests
- `src/api/modules/userAPI.js` - Thêm console.log cho login/getUser
- `src/pages/auths/LoginPage.jsx` - Thêm console.log cho login process

### Files test:
- `test-login.html` - Test API trực tiếp
- `check-backend.js` - Kiểm tra backend server

## 7. Hướng dẫn khắc phục

### Nếu backend không chạy:
1. Khởi động backend server
2. Kiểm tra port 8000 có available không
3. Test API bằng Postman trước

### Nếu có lỗi CORS:
1. Cấu hình CORS trong backend
2. Thêm headers phù hợp

### Nếu có lỗi authentication:
1. Kiểm tra email/password
2. Kiểm tra API endpoint
3. Kiểm tra request format

## 8. Thông tin cần cung cấp

Khi báo lỗi, hãy cung cấp:
1. **Console logs** từ Developer Tools
2. **Network tab** screenshots
3. **Backend server status** (có chạy không?)
4. **Thông báo lỗi cụ thể** hiển thị trên UI
5. **Steps to reproduce** (các bước để tái hiện lỗi)

## 9. Test Cases

### Test Case 1: Backend Connection
- [ ] Backend server chạy trên port 8000
- [ ] API endpoint `/api/v1/login` accessible
- [ ] CORS configured properly

### Test Case 2: Login Functionality
- [ ] Login với email/password đúng
- [ ] Nhận được access_token
- [ ] User data được convert đúng format
- [ ] localStorage được lưu đúng

### Test Case 3: User Data Retrieval
- [ ] Get user by ID hoạt động
- [ ] User data được hiển thị đúng
- [ ] Profile update hoạt động

## 10. Next Steps

1. **Kiểm tra backend server** - Đảm bảo server đang chạy
2. **Test API trực tiếp** - Sử dụng Postman hoặc test-login.html
3. **Kiểm tra Console logs** - Xem logs chi tiết
4. **Cung cấp thông tin lỗi** - Để có thể debug chính xác hơn 