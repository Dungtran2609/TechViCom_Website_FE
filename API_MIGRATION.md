# API Migration Guide

## Tổng quan

Dự án đã được cập nhật để sử dụng API mới tại `http://localhost:8000/api/v1` thay vì API cũ tại `http://localhost:3001`.

## Thay đổi chính

### 1. Cấu trúc Response

**API Cũ:**
```json
{
  "id": "bf09",
  "name": "MAI HOANG ANH",
  "phone": "0339820483",
  "password": "0987654321",
  "email": "Dhj@mail.thitcholuoc.edu.vn"
}
```

**API Mới:**
```json
{
  "access_token": "2|hN68TPAmlxgWvqNO78Nh31P48M1gRPry2m1eMekO409bafef",
  "user": {
    "id": 13,
    "name": "Admin",
    "email": "admin@gmail.com",
    "password": "$2y$12$rdn/sxBjtY7JPCg9YfBL1.fTRwmspZKasmJQndXTFoSbZPn6xBlZK",
    "phone_number": "0999999999",
    "image_profile": "admin.jpg",
    "birthday": "1990-01-01",
    "gender": "male",
    "is_active": 1
  }
}
```

### 2. Authentication

- **API Cũ**: Không có authentication
- **API Mới**: Sử dụng Bearer Token authentication

### 3. Endpoints

| Chức năng | API Cũ | API Mới |
|-----------|--------|---------|
| Login | `POST /users` (search) | `POST /login` |
| Register | `POST /users` | `POST /register` |
| Get User | `GET /users/:id` | `GET /users/:id` |
| Update User | `PATCH /users/:id` | `PUT /users/:id` |
| Logout | Không có | `POST /logout` |

### 4. Field Mapping

| Field Cũ | Field Mới | Ghi chú |
|----------|-----------|---------|
| `phone` | `phone_number` | Tên field thay đổi |
| `avatar` | `image_profile` | Tên field thay đổi |
| `gender` | `gender` | Giá trị: `male`, `female`, `other` |
| `birthday` | `birthday` | Format: `YYYY-MM-DD` |

## Cập nhật Code

### 1. API Client (`src/api/client.js`)

- Thay đổi `API_BASE_URL` từ `http://localhost:3001` sang `http://localhost:8000/api/v1`
- Thêm hỗ trợ Bearer Token authentication
- Thêm method `setAccessToken()` để quản lý token

### 2. User API (`src/api/modules/userAPI.js`)

- Cập nhật tất cả methods để sử dụng API mới
- Thêm chuyển đổi cấu trúc data giữa API cũ và mới
- Thêm method `logout()`

### 3. Login Page (`src/pages/auths/LoginPage.jsx`)

- Thay đổi từ `phone` sang `email` cho đăng nhập
- Cập nhật validation và error handling

### 4. Register Page (`src/pages/auths/RegisterPage.jsx`)

- Thay đổi validation từ `phone` sang `email`
- Cập nhật user data structure

### 5. Account Page (`src/pages/users/AccountPage.jsx`)

- Thêm functions để chuyển đổi gender format
- Cập nhật field mapping cho update user
- Bỏ validation password cũ (vì đã hash)

## Testing

Sử dụng file `test-api.html` để test API mới:

1. Mở file `test-api.html` trong browser
2. Click "Test Login" để đăng nhập
3. Click "Test Get User" để lấy thông tin user
4. Click "Test Update User" để cập nhật thông tin

## Credentials Test

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

## Lưu ý

1. **Password**: API mới sử dụng hash password, không thể so sánh trực tiếp
2. **Gender**: API mới sử dụng `male`, `female`, `other` thay vì `Nam`, `Nữ`, `Khác`
3. **Authentication**: Tất cả requests (trừ login/register) cần Bearer Token
4. **Error Handling**: Cấu trúc error response có thể khác với API cũ

## Rollback

Nếu cần rollback về API cũ:

1. Thay đổi `API_BASE_URL` trong `src/api/client.js` về `http://localhost:3001`
2. Bỏ Bearer Token authentication
3. Cập nhật lại field mapping trong `userAPI.js`
4. Thay đổi validation trong LoginPage về `phone` 