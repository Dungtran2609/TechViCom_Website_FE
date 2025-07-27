# Sử dụng API Categories - TechViCom Website

## Tổng quan

Hệ thống categories đã được cập nhật để sử dụng hoàn toàn dữ liệu từ API trong `db.json` thay vì dữ liệu cứng (hardcoded). Điều này giúp:

- **Linh hoạt**: Có thể thay đổi categories mà không cần deploy lại code
- **Quản lý tập trung**: Tất cả dữ liệu categories được quản lý trong db.json
- **Tính nhất quán**: Đảm bảo dữ liệu giống nhau giữa các component
- **Dễ bảo trì**: Chỉ cần cập nhật db.json để thay đổi categories

## Cấu trúc API Categories

### 1. Endpoint
```
GET http://localhost:3001/categories
```

### 2. Cấu trúc dữ liệu trong db.json
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Điện thoại",
      "icon": "FaMobileAlt",
      "path": "/dien-thoai",
      "subcategories": [
        {
          "name": "iPhone",
          "path": "/dien-thoai/iphone",
          "isPopular": true
        },
        {
          "name": "Samsung",
          "path": "/dien-thoai/samsung",
          "isPopular": true
        }
      ],
      "featuredProducts": [
        {
          "id": 6,
          "name": "iPhone 15 Pro Max 256GB",
          "price": "31.990.000đ",
          "image": "/images/products/iphone-15-pro.jpg"
        }
      ]
    }
  ]
}
```

### 3. Các trường dữ liệu

| Trường | Kiểu | Mô tả |
|--------|------|-------|
| `id` | string | ID duy nhất của category |
| `name` | string | Tên hiển thị của category |
| `icon` | string | Tên icon component (ví dụ: "FaMobileAlt") |
| `path` | string | Đường dẫn URL của category |
| `subcategories` | array | Danh sách subcategories |
| `featuredProducts` | array | Sản phẩm nổi bật của category |
| `isHot` | boolean | Category có hot không (optional) |

## Icon Mapping

### 1. Các icon được hỗ trợ
```javascript
export const iconMap = {
  FaMobileAlt,    // Điện thoại
  FaLaptop,       // Laptop
  FaHeadphones,   // Phụ kiện
  FaTabletAlt,    // Máy tính bảng
  MdAir,          // Điều hòa
  MdKitchen,      // Tủ lạnh
  BsFan,          // Quạt điều hòa
  IoPhonePortrait, // SIM Techvicom
  GiWashingMachine // Điện gia dụng
};
```

### 2. Tạo icon component
```javascript
export const createIconComponent = (iconName, size = 50) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found`);
    return <FaMobileAlt size={size} style={{...}} />;
  }
  return <IconComponent size={size} style={{...}} />;
};
```

## API Functions

### 1. getCategoriesWithData() - Cho HomePage
```javascript
export const getCategoriesWithData = async () => {
  try {
    const response = await fetch('http://localhost:3001/categories');
    const apiCategories = await response.json();
    
    // Chuyển đổi API data thành format cho HomePage
    return apiCategories.map(category => ({
      id: category.id,
      name: category.name,
      icon: createIconComponent(category.icon),
      path: category.path,
      iconName: category.icon
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array instead of fallback
  }
};
```

### 2. getHeaderCategories() - Cho Header
```javascript
export const getHeaderCategories = async () => {
  try {
    const response = await fetch('http://localhost:3001/categories');
    const apiCategories = await response.json();
    
    // Trả về API data trực tiếp vì đã có đầy đủ thông tin
    return apiCategories;
  } catch (error) {
    console.error('Error fetching header categories:', error);
    return []; // Return empty array instead of fallback
  }
};
```

## Custom Hooks

### 1. useHomeCategories()
```javascript
const { categories, loading, error } = useHomeCategories();
```

**Returns:**
- `categories`: Array of simplified category objects với icon components
- `loading`: Boolean loading state
- `error`: Error message nếu có

### 2. useHeaderCategories()
```javascript
const { categories, loading, error } = useHeaderCategories();
```

**Returns:**
- `categories`: Array of detailed category objects với subcategories và featured products
- `loading`: Boolean loading state
- `error`: Error message nếu có

## Error Handling

### 1. Loading States
```javascript
if (loading) {
  return <div>Đang tải danh mục...</div>;
}
```

### 2. Error States
```javascript
if (error) {
  return <div>Lỗi: {error}</div>;
}
```

### 3. Empty States
```javascript
if (categories.length === 0) {
  return <div>Không có danh mục nào.</div>;
}
```

## Components

### 1. CategoriesGrid
```javascript
<CategoriesGrid 
  categories={categories} 
  loading={loading}
  error={error}
/>
```

**Features:**
- Loading spinner
- Error display
- Empty state
- Responsive grid layout

### 2. Header Categories Menu
```javascript
// Tự động hiển thị categories từ API
// Với loading và error states
```

## Cách thêm Category mới

### 1. Thêm vào db.json
```json
{
  "id": "10",
  "name": "Category mới",
  "icon": "FaNewIcon",
  "path": "/category-moi",
  "subcategories": [
    {
      "name": "Subcategory 1",
      "path": "/category-moi/sub1",
      "isPopular": true
    }
  ],
  "featuredProducts": [
    {
      "id": 21,
      "name": "Sản phẩm nổi bật",
      "price": "1.000.000đ",
      "image": "/images/products/product.jpg"
    }
  ]
}
```

### 2. Thêm icon vào iconMap (nếu cần)
```javascript
import { FaNewIcon } from 'react-icons/fa';

export const iconMap = {
  // ... existing icons
  FaNewIcon,
};
```

## Performance Optimizations

### 1. Caching
- Categories được cache trong hooks
- Không refetch không cần thiết

### 2. Error Recovery
- Fallback to empty array thay vì crash
- Graceful degradation

### 3. Loading States
- Skeleton loading cho UX tốt hơn
- Non-blocking UI

## Troubleshooting

### 1. Categories không hiển thị
```bash
# Kiểm tra API endpoint
curl http://localhost:3001/categories

# Kiểm tra server
npm run dev
```

### 2. Icons không hiển thị
```javascript
// Kiểm tra icon name trong db.json
console.log('Icon name:', category.icon);

// Kiểm tra iconMap
console.log('Available icons:', Object.keys(iconMap));
```

### 3. API errors
```javascript
// Kiểm tra network tab
// Kiểm tra console errors
// Kiểm tra server logs
```

## Best Practices

### 1. Data Management
- Luôn sử dụng API thay vì hardcoded data
- Implement proper error handling
- Provide meaningful error messages

### 2. Icon Management
- Sử dụng consistent icon naming
- Validate icon names trước khi render
- Provide fallback icons

### 3. Performance
- Implement loading states
- Cache API responses
- Optimize re-renders

### 4. UX
- Show loading indicators
- Display error messages clearly
- Provide empty states

## Migration từ Hardcoded Data

### 1. Trước (Hardcoded)
```javascript
const categories = [
  { id: 1, name: 'Điện thoại', icon: <FaMobileAlt />, path: '/dien-thoai' }
];
```

### 2. Sau (API-based)
```javascript
const { categories, loading, error } = useHomeCategories();
```

### 3. Benefits
- ✅ Dynamic data
- ✅ Centralized management
- ✅ Better error handling
- ✅ Consistent across components

## Future Improvements

### 1. Real-time Updates
- WebSocket cho live updates
- Server-sent events
- Polling mechanism

### 2. Caching Strategy
- React Query integration
- Service Worker caching
- Local storage backup

### 3. Admin Panel
- CRUD operations cho categories
- Drag & drop reordering
- Bulk operations

### 4. Analytics
- Category click tracking
- Popular categories
- User behavior analysis 