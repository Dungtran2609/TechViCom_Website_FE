import React from 'react';
import { Link } from 'react-router-dom';
import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { BsFan } from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';
import { CategoryGridSkeleton } from './LoadingSkeletons';

// Icon mapping: key là string tên icon, value là component
const iconMap = {
  'FaMobileAlt': FaMobileAlt,
  'FaLaptop': FaLaptop,
  'FaHeadphones': FaHeadphones,
  'MdAir': MdAir,
  'MdKitchen': MdKitchen,
  'BsFan': BsFan,
  'IoPhonePortrait': IoPhonePortrait,
  'GiWashingMachine': GiWashingMachine,
  'FaTabletAlt': FaTabletAlt,
};

// Hàm tạo icon component
const createIconComponent = (iconName, size = 50) => {
  const IconComponent = iconMap[iconName] || FaMobileAlt;
  if (!iconMap[iconName]) {
    console.warn(`Icon ${iconName} not found`);
  }
  return <IconComponent size={size} style={{ color: '#ff6c2f', stroke: 'black', strokeWidth: '1' }} />;
};

const CategoriesGrid = ({ categories, loading, error, className = "categories-grid" }) => {
  if (loading) {
    return <CategoryGridSkeleton count={8} />;
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