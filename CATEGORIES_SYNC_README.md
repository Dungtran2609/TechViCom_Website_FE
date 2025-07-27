# Đồng bộ Categories - TechViCom Website

## Tổng quan

Hệ thống đồng bộ categories giữa HomePage và Header đã được cải thiện để:
- Sử dụng shared data source
- Tái sử dụng components
- Quản lý state tập trung
- Tối ưu performance

## Cấu trúc Files

### 1. Shared Data (`src/data/categories.js`)
```javascript
// Categories cho HomePage (đơn giản)
export const homeCategories = [...]

// Categories cho Header (với subcategories và featured products)
export const getHeaderCategories = async () => {...}

// Icon mapping
export const iconMap = {...}
```

### 2. Custom Hooks (`src/hooks/useCategories.js`)
```javascript
// Hook cho HomePage
export const useHomeCategories = () => {...}

// Hook cho Header
export const useHeaderCategories = () => {...}
```

### 3. Reusable Component (`src/components/CategoriesGrid.jsx`)
```javascript
const CategoriesGrid = ({ categories, loading, className }) => {...}
```

## Cách hoạt động

### 1. Data Flow
```
API (db.json) → categories.js → useCategories Hook → Components
```

### 2. HomePage Categories
- **Data Source**: `getCategoriesWithData()` từ `categories.js`
- **Hook**: `useHomeCategories()`
- **Component**: `CategoriesGrid`
- **Features**: Icons, names, paths

### 3. Header Categories
- **Data Source**: `getHeaderCategories()` từ `categories.js`
- **Hook**: `useHeaderCategories()`
- **Features**: Subcategories, featured products, search, hover effects

## Các loại Categories

### 1. HomePage Categories (Đơn giản)
```javascript
{
  id: 1,
  name: 'Điện thoại',
  icon: <FaMobileAlt size={50} style={{...}} />,
  path: '/dien-thoai',
  iconName: 'FaMobileAlt'
}
```

### 2. Header Categories (Chi tiết)
```javascript
{
  id: 1,
  name: 'Điện thoại',
  icon: 'FaMobileAlt',
  path: '/dien-thoai',
  subcategories: [...],
  featuredProducts: [...],
  isHot: false
}
```

## Icons Mapping

### Icon Components
```javascript
import { 
  FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones 
} from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { BsFan } from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';
```

### Icon Map
```javascript
export const iconMap = {
  FaMobileAlt, FaLaptop, FaHeadphones, MdAir, MdKitchen,
  BsFan, IoPhonePortrait, GiWashingMachine, FaTabletAlt,
};
```

## Components

### 1. CategoriesGrid
```javascript
<CategoriesGrid 
  categories={categories} 
  loading={loadingCategories}
  className="custom-grid" // optional
/>
```

**Props:**
- `categories`: Array of category objects
- `loading`: Boolean loading state
- `className`: Optional CSS class

### 2. HomePage Integration
```javascript
const HomePage = () => {
  const { categories, loading, error } = useHomeCategories();
  
  return (
    <section className="categories-section center-section">
      <CategoriesGrid 
        categories={categories} 
        loading={loading}
      />
    </section>
  );
};
```

### 3. Header Integration
```javascript
const Header = () => {
  const { categories, loading, error } = useHeaderCategories();
  
  return (
    <div className="categories-menu">
      {categories.map(category => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};
```

## Hooks

### 1. useHomeCategories
```javascript
const { categories, loading, error } = useHomeCategories();
```

**Returns:**
- `categories`: Array of simplified category objects
- `loading`: Boolean loading state
- `error`: Error message if any

### 2. useHeaderCategories
```javascript
const { categories, loading, error } = useHeaderCategories();
```

**Returns:**
- `categories`: Array of detailed category objects with subcategories
- `loading`: Boolean loading state
- `error`: Error message if any

## API Integration

### 1. Fetch Categories
```javascript
// From categories.js
export const getCategoriesWithData = async () => {
  try {
    const response = await fetch('http://localhost:3001/categories');
    const apiCategories = await response.json();
    
    // Merge API data với local data
    return homeCategories.map(homeCat => {
      const apiCat = apiCategories.find(apiCat => apiCat.name === homeCat.name);
      if (apiCat) {
        return { ...homeCat, ...apiCat, icon: homeCat.icon };
      }
      return homeCat;
    });
  } catch (error) {
    return homeCategories; // Fallback
  }
};
```

### 2. Error Handling
```javascript
// Fallback khi API không hoạt động
if (error) {
  console.error('Categories error:', error);
  // Hiển thị loading hoặc error state
}
```

## Performance Optimizations

### 1. Caching
- Categories được cache trong hooks
- Không refetch không cần thiết

### 2. Lazy Loading
- Categories chỉ load khi component mount
- Loading states cho UX tốt hơn

### 3. Memoization
- Categories được memoize trong hooks
- Tránh re-render không cần thiết

## Styling

### 1. CSS Classes
```css
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.category-icon {
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 600;
  text-align: center;
}
```

### 2. Responsive Design
```css
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
```

## Troubleshooting

### 1. Categories không hiển thị
- Kiểm tra API endpoint `/categories`
- Kiểm tra network connection
- Kiểm tra console errors

### 2. Icons không hiển thị
- Kiểm tra import statements
- Kiểm tra iconMap mapping
- Kiểm tra iconName trong data

### 3. Loading states
- Kiểm tra loading logic trong hooks
- Kiểm tra error handling
- Kiểm tra fallback data

### 4. Performance issues
- Kiểm tra unnecessary re-renders
- Kiểm tra API calls frequency
- Kiểm tra memory leaks

## Best Practices

### 1. Data Management
- Sử dụng shared data source
- Implement proper error handling
- Provide fallback data

### 2. Component Design
- Tái sử dụng components
- Props validation
- Consistent styling

### 3. Performance
- Lazy loading
- Memoization
- Efficient re-renders

### 4. UX
- Loading states
- Error states
- Responsive design

## Future Improvements

### 1. Caching Strategy
- Implement React Query
- Add cache invalidation
- Optimize API calls

### 2. Dynamic Categories
- Admin panel để quản lý categories
- Real-time updates
- A/B testing support

### 3. Analytics
- Track category clicks
- User behavior analysis
- Performance metrics

### 4. Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support 