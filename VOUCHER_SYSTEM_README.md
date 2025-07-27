# Hệ thống Voucher - TechViCom Website

## Tổng quan

Hệ thống voucher được tích hợp vào website TechViCom với các tính năng chính:
- Quản lý voucher trong database
- Validate voucher khi checkout
- Hiển thị voucher khuyến mãi trên trang chủ
- Tính toán giảm giá tự động

## Cấu trúc Database

### Bảng Vouchers trong db.json

```json
{
  "vouchers": [
    {
      "id": "VOUCHER001",
      "code": "WELCOME10",
      "name": "Giảm 10% cho khách hàng mới",
      "description": "Giảm 10% cho đơn hàng từ 500.000đ",
      "discountType": "percentage",
      "discountValue": 10,
      "minOrderValue": 500000,
      "maxDiscount": 1000000,
      "startDate": "2025-01-01",
      "endDate": "2025-12-31",
      "usageLimit": 1000,
      "usedCount": 0,
      "isActive": true,
      "applicableCategories": ["all"]
    }
  ]
}
```

### Các trường dữ liệu:

- **id**: ID duy nhất của voucher
- **code**: Mã voucher (ví dụ: WELCOME10)
- **name**: Tên voucher
- **description**: Mô tả voucher
- **discountType**: Loại giảm giá (percentage, fixed, shipping)
- **discountValue**: Giá trị giảm giá
- **minOrderValue**: Giá trị đơn hàng tối thiểu
- **maxDiscount**: Mức giảm giá tối đa
- **startDate**: Ngày bắt đầu hiệu lực
- **endDate**: Ngày kết thúc hiệu lực
- **usageLimit**: Số lượt sử dụng tối đa
- **usedCount**: Số lượt đã sử dụng
- **isActive**: Trạng thái hoạt động
- **applicableCategories**: Danh mục áp dụng (["all"] hoặc ["dien-thoai", "laptop"])

## Các loại Voucher

### 1. Giảm giá theo phần trăm (percentage)
```json
{
  "discountType": "percentage",
  "discountValue": 10,
  "maxDiscount": 1000000
}
```
- Giảm 10% giá trị đơn hàng
- Tối đa 1.000.000đ

### 2. Giảm giá cố định (fixed)
```json
{
  "discountType": "fixed",
  "discountValue": 50000,
  "maxDiscount": 50000
}
```
- Giảm cố định 50.000đ
- Không vượt quá maxDiscount

### 3. Miễn phí vận chuyển (shipping)
```json
{
  "discountType": "shipping",
  "discountValue": 30000,
  "maxDiscount": 30000
}
```
- Miễn phí vận chuyển 30.000đ

## Các Component

### 1. VoucherInput.jsx
Component nhập và validate voucher trong trang checkout.

**Props:**
- `cartItems`: Danh sách sản phẩm trong giỏ hàng
- `totalAmount`: Tổng tiền đơn hàng
- `onVoucherApplied`: Callback khi voucher được áp dụng
- `appliedVoucher`: Voucher đã được áp dụng
- `onVoucherRemoved`: Callback khi xóa voucher

### 2. VoucherDisplay.jsx
Component hiển thị voucher khuyến mãi trên trang chủ.

**Props:**
- `limit`: Số lượng voucher hiển thị (mặc định: 3)

### 3. VoucherManagementPage.jsx
Trang quản lý voucher cho admin.

## API Functions

### 1. getVouchers()
Lấy danh sách tất cả voucher từ database.

### 2. validateVoucher(code, cartItems, totalAmount)
Validate voucher với các điều kiện:
- Voucher tồn tại và đang hoạt động
- Trong thời gian hiệu lực
- Chưa hết lượt sử dụng
- Đơn hàng đạt giá trị tối thiểu
- Sản phẩm thuộc danh mục áp dụng

### 3. calculateDiscount(voucher, totalAmount)
Tính toán mức giảm giá dựa trên loại voucher.

### 4. updateVoucherUsage(voucherId)
Cập nhật số lượt sử dụng voucher.

## Tích hợp vào Checkout

### 1. Import components
```javascript
import VoucherInput from '../components/VoucherInput';
import { updateVoucherUsage } from '../api/vouchers';
```

### 2. State management
```javascript
const [appliedVoucher, setAppliedVoucher] = useState(null);
```

### 3. Tính toán giá
```javascript
const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
const shippingFee = form.delivery === 'Giao hàng tận nơi' ? 30000 : 0;
const voucherDiscount = appliedVoucher ? appliedVoucher.discountAmount : 0;
const total = subtotal + shippingFee - voucherDiscount;
```

### 4. Render VoucherInput
```javascript
<VoucherInput
  cartItems={cartItems}
  totalAmount={subtotal}
  onVoucherApplied={handleVoucherApplied}
  appliedVoucher={appliedVoucher}
  onVoucherRemoved={handleVoucherRemoved}
/>
```

## Voucher mẫu trong Database

### 1. WELCOME10 - Giảm 10% cho khách hàng mới
- Giảm 10% cho đơn hàng từ 500.000đ
- Tối đa 1.000.000đ
- Áp dụng cho tất cả sản phẩm

### 2. FLASH50K - Giảm 50.000đ
- Giảm cố định 50.000đ cho đơn hàng từ 1.000.000đ
- Áp dụng cho tất cả sản phẩm

### 3. PHONE20 - Giảm 20% cho điện thoại
- Giảm 20% cho điện thoại
- Đơn hàng tối thiểu 1.000.000đ
- Tối đa 2.000.000đ

### 4. LAPTOP15 - Giảm 15% cho laptop
- Giảm 15% cho laptop
- Đơn hàng tối thiểu 2.000.000đ
- Tối đa 1.500.000đ

### 5. FREESHIP - Miễn phí vận chuyển
- Miễn phí vận chuyển cho đơn hàng từ 500.000đ
- Giá trị 30.000đ

## Cách sử dụng

### 1. Thêm voucher mới
Thêm vào `db.json`:
```json
{
  "id": "VOUCHER006",
  "code": "NEWVOUCHER",
  "name": "Voucher mới",
  "description": "Mô tả voucher",
  "discountType": "percentage",
  "discountValue": 15,
  "minOrderValue": 1000000,
  "maxDiscount": 500000,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "usageLimit": 100,
  "usedCount": 0,
  "isActive": true,
  "applicableCategories": ["dien-thoai", "laptop"]
}
```

### 2. Test voucher
1. Vào trang checkout
2. Nhập mã voucher vào ô "Mã giảm giá"
3. Click "Áp dụng"
4. Kiểm tra giảm giá được tính toán

### 3. Quản lý voucher
Truy cập `/voucher-management` để xem danh sách và quản lý voucher.

## Lưu ý

1. **Validation**: Hệ thống kiểm tra đầy đủ các điều kiện trước khi áp dụng voucher
2. **Security**: Voucher được validate server-side để tránh gian lận
3. **Performance**: Voucher được cache để tăng tốc độ load
4. **UX**: Hiển thị thông báo rõ ràng khi voucher hợp lệ/không hợp lệ
5. **Tracking**: Số lượt sử dụng được cập nhật tự động

## Troubleshooting

### Voucher không hoạt động
1. Kiểm tra `isActive: true`
2. Kiểm tra ngày hiệu lực
3. Kiểm tra số lượt sử dụng
4. Kiểm tra giá trị đơn hàng tối thiểu

### Lỗi API
1. Kiểm tra server JSON đang chạy
2. Kiểm tra endpoint `/vouchers`
3. Kiểm tra cấu trúc dữ liệu trong db.json

### Voucher không hiển thị trên trang chủ
1. Kiểm tra `isActive: true`
2. Kiểm tra ngày hiệu lực
3. Kiểm tra `usedCount < usageLimit` 