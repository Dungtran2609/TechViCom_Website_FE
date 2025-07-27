import React from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { BsFan } from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';

// Icon mapping
const iconMap = {
  FaMobileAlt, FaLaptop, FaHeadphones, MdAir, MdKitchen,
  BsFan, IoPhonePortrait, GiWashingMachine, FaTabletAlt,
};

// Hàm tạo icon component
const createIconComponent = (iconName, size = 50) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found`);
    return <FaMobileAlt size={size} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />;
  }
  return <IconComponent size={size} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />;
};

const CategoriesGrid = ({ categories, loading, error, className = "categories-grid" }) => {
  if (loading) {
    return (
      <div className={className}>
        <div style={{padding: 40, textAlign: 'center', width: '100%'}}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          Đang tải danh mục...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div style={{padding: 40, textAlign: 'center', width: '100%', color: '#ef4444'}}>
          <div className="mb-2">⚠️</div>
          <div className="font-medium">{error}</div>
          <div className="text-sm text-gray-500 mt-2">Vui lòng thử lại sau</div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={className}>
        <div style={{padding: 40, textAlign: 'center', width: '100%'}}>
          <div className="text-gray-500">📂</div>
          <div className="font-medium text-gray-700">Không có danh mục nào.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {categories.map((category) => (
        <Link to={`/products${category.path}`} key={category.id} className="category-card">
          <div className="category-icon">
            {createIconComponent(category.iconName)}
          </div>
          <h3 className="category-name">{category.name}</h3>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesGrid; 