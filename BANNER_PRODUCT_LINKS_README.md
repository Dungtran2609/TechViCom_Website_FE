# Banner với Product Links - TechViCom Website

## Tổng quan

Hệ thống banner đã được cập nhật để khi click vào banner sẽ chuyển đến trang chi tiết sản phẩm tương ứng. Điều này giúp:

- **Tăng conversion rate**: Người dùng có thể dễ dàng xem chi tiết sản phẩm
- **UX tốt hơn**: Không cần tìm kiếm sản phẩm thủ công
- **Marketing hiệu quả**: Banner trở thành công cụ marketing mạnh mẽ
- **Thông tin rõ ràng**: Hiển thị tên và giá sản phẩm ngay trên banner

## Cấu trúc dữ liệu Banner

### 1. Cấu trúc trong db.json
```json
{
  "banners": [
    {
      "id": "1",
      "image": "/images/banners/banner1.jpg",
      "title": "TẬN BỪNG ĐỈNH - AI SMART",
      "subtitle": "Laptop chỉ từ 8.990.000Đ",
      "features": [
        "Trả góp 0%",
        "Giảm thêm 5%",
        "Tặng SIM Techvicom 60GB/tháng"
      ],
      "buttonText": "Khám phá ngay",
      "link": "/product/11",
      "productId": "11",
      "productName": "MacBook Air M2",
      "productPrice": "24.990.000đ"
    }
  ]
}
```

### 2. Các trường dữ liệu

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `id` | string | ID duy nhất của banner |
| `image` | string | Đường dẫn hình ảnh banner |
| `title` | string | Tiêu đề chính của banner |
| `subtitle` | string | Tiêu đề phụ |
| `features` | array | Danh sách tính năng nổi bật |
| `buttonText` | string | Text của nút CTA |
| `link` | string | Link đến trang chi tiết sản phẩm |
| `productId` | string | ID sản phẩm (optional) |
| `productName` | string | Tên sản phẩm (optional) |
| `productPrice` | string | Giá sản phẩm (optional) |

## Tính năng mới

### 1. Product Info Display
```javascript
{banner.productName && (
  <div className="product-info-banner">
    <div className="product-name-banner">{banner.productName}</div>
    <div className="product-price-banner">{banner.productPrice}</div>
  </div>
)}
```

**Features:**
- Hiển thị tên sản phẩm
- Hiển thị giá sản phẩm
- Background blur với transparency
- Responsive design

### 2. Product Overlay
```javascript
{banner.productId && (
  <div className="product-overlay">
    <div className="product-details">
      <h3>{banner.productName}</h3>
      <p className="price">{banner.productPrice}</p>
      <Link to={banner.link} className="view-product-btn">
        Xem chi tiết
      </Link>
    </div>
  </div>
)}
```

**Features:**
- Hover effect để hiển thị thông tin sản phẩm
- Nút "Xem chi tiết" trực tiếp
- Gradient background
- Smooth animation

## Styling

### 1. Product Info Banner
```css
.product-info-banner {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.product-name-banner {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.product-price-banner {
  font-size: 20px;
  font-weight: 700;
  color: #FFD700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```

### 2. Product Overlay
```css
.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  padding: 20px;
  border-radius: 0 0 16px 16px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.banner-image:hover .product-overlay {
  transform: translateY(0);
}
```

### 3. View Product Button
```css
.view-product-btn {
  display: inline-block;
  background: #ff6c2f;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.view-product-btn:hover {
  background: #e55a1f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 108, 47, 0.3);
}
```

## Responsive Design

### 1. Mobile (≤768px)
```css
@media (max-width: 768px) {
  .product-overlay {
    position: relative;
    transform: none;
    background: rgba(0,0,0,0.7);
    margin-top: 16px;
    border-radius: 12px;
  }

  .product-info-banner {
    margin: 12px 0;
    padding: 12px;
  }
}
```

### 2. Small Mobile (≤480px)
```css
@media (max-width: 480px) {
  .product-info-banner {
    padding: 8px;
    margin: 8px 0;
  }

  .product-name-banner {
    font-size: 14px;
  }

  .product-price-banner {
    font-size: 16px;
  }
}
```

## Cách thêm Banner mới

### 1. Thêm vào db.json
```json
{
  "id": "4",
  "image": "/images/banners/banner4.jpg",
  "title": "iPhone 15 Pro Max",
  "subtitle": "Giảm ngay 3.000.000đ",
  "features": [
    "Chip A17 Pro",
    "Camera 48MP",
    "Titanium Design"
  ],
  "buttonText": "Mua ngay",
  "link": "/product/1",
  "productId": "1",
  "productName": "iPhone 15 Pro Max 256GB",
  "productPrice": "31.990.000đ"
}
```

### 2. Thêm hình ảnh
```bash
# Thêm file hình ảnh vào
public/images/banners/banner4.jpg
```

## User Experience

### 1. Desktop
- **Hover effect**: Di chuột vào banner để xem thông tin sản phẩm
- **Click**: Click vào banner hoặc nút để chuyển đến trang chi tiết
- **Visual feedback**: Animation mượt mà

### 2. Mobile
- **Always visible**: Thông tin sản phẩm luôn hiển thị
- **Touch friendly**: Nút đủ lớn để dễ chạm
- **Fast loading**: Tối ưu cho mobile

## Analytics & Tracking

### 1. Click Tracking
```javascript
// Có thể thêm tracking
const handleBannerClick = (bannerId, productId) => {
  // Track banner click
  analytics.track('banner_click', {
    banner_id: bannerId,
    product_id: productId,
    timestamp: new Date()
  });
};
```

### 2. Conversion Metrics
- Banner click rate
- Product page view từ banner
- Purchase conversion từ banner

## Best Practices

### 1. Banner Design
- **High contrast**: Text dễ đọc trên background
- **Clear CTA**: Nút rõ ràng và dễ thấy
- **Product focus**: Sản phẩm là trung tâm của banner

### 2. Product Information
- **Accurate pricing**: Giá chính xác và cập nhật
- **Clear product name**: Tên sản phẩm rõ ràng
- **Relevant features**: Tính năng liên quan đến sản phẩm

### 3. Performance
- **Optimized images**: Hình ảnh được tối ưu
- **Fast loading**: Banner load nhanh
- **Smooth animations**: Animation mượt mà

## Troubleshooting

### 1. Banner không hiển thị
```javascript
// Kiểm tra API
fetch('http://localhost:3001/banners')
  .then(res => res.json())
  .then(console.log);
```

### 2. Link không hoạt động
```javascript
// Kiểm tra route
console.log('Banner link:', banner.link);
// Đảm bảo route tồn tại trong React Router
```

### 3. Product info không hiển thị
```javascript
// Kiểm tra dữ liệu
console.log('Product data:', {
  productId: banner.productId,
  productName: banner.productName,
  productPrice: banner.productPrice
});
```

## Future Improvements

### 1. Dynamic Banners
- A/B testing cho banner
- Personalized banners
- Time-based banner rotation

### 2. Advanced Analytics
- Heat map cho banner clicks
- User behavior tracking
- Conversion funnel analysis

### 3. Interactive Features
- Video banners
- 360° product views
- AR preview integration

### 4. Performance
- Lazy loading cho banner images
- Progressive image loading
- CDN integration 