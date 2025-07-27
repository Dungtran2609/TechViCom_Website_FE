import { FaMobileAlt, FaLaptop, FaTabletAlt, FaHeadphones } from 'react-icons/fa';
import { MdAir, MdKitchen } from 'react-icons/md';
import { IoPhonePortrait } from 'react-icons/io5';
import { BsFan } from 'react-icons/bs';
import { GiWashingMachine } from 'react-icons/gi';

// Tạo iconMap để ánh xạ tên icon sang component
export const iconMap = {
  FaMobileAlt, FaLaptop, FaHeadphones, MdAir, MdKitchen,
  BsFan, IoPhonePortrait, GiWashingMachine, FaTabletAlt,
};

// Hàm để lấy categories từ API cho HomePage (đơn giản)
export const getCategoriesWithData = async () => {
  try {
    const response = await fetch('http://localhost:3001/categories');
    const apiCategories = await response.json();
    
    // Chuyển đổi API data thành format cho HomePage
    return apiCategories.map(category => ({
      id: category.id,
      name: category.name,
      iconName: category.icon, // Chỉ trả về tên icon, không tạo component
      path: category.path
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array instead of fallback
  }
};

// Hàm để lấy categories cho Header (với subcategories và featured products)
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