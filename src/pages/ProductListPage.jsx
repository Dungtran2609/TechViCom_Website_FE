import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { FaStar, FaRegHeart } from 'react-icons/fa';

const phoneProducts = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A',
    price: 30390000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    discount: 13,
    installment: 'Trả góp 0%',
    tags: ['6.8 inches', '256 GB'],
    smember: 30400000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6-9-12 tháng',
    rating: 5,
    ratingCount: 120,
    liked: false,
    promo: 'Yêu thích',
    stars: 5
  },
  {
    id: 2,
    name: 'Xiaomi 14T Pro 12GB 512GB',
    price: 16990000,
    originalPrice: 17990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    discount: 6,
    installment: 'Trả góp 0%',
    tags: ['6.67 inches', '12 GB', '512 GB'],
    smember: 17000000,
    smemberText: 'S-Student giảm thêm đến',
    description: 'Không phí chuyển đổi khi trả góp 0% qua thẻ tín dụng kỳ hạn 3-6-9-12 tháng',
    rating: 5,
    ratingCount: 80,
    liked: false,
    promo: 'Yêu thích',
    stars: 5
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    discount: 7,
    installment: 'Trả góp 0%',
    tags: ['6.8 inches', '256 GB'],
    smember: 30000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Thu cũ đổi mới trợ giá đến 5 triệu',
    rating: 4.5,
    ratingCount: 100,
    liked: false,
    promo: 'Yêu thích',
    stars: 4
  },
  {
    id: 4,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    discount: 8,
    installment: 'Trả góp 0%',
    tags: ['6.7 inches', '256 GB'],
    smember: 26000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu',
    rating: 4,
    ratingCount: 70,
    liked: false,
    promo: 'Yêu thích',
    stars: 4
  },
  {
    id: 5,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    discount: 10,
    installment: 'Trả góp 0%',
    tags: ['6.7 inches', '256 GB'],
    smember: 9000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng PMH 500.000đ mua kèm phụ kiện',
    rating: 3.5,
    ratingCount: 50,
    liked: false,
    promo: 'Yêu thích',
    stars: 3
  },
  {
    id: 6,
    name: 'Google Pixel 8 Pro',
    price: 22990000,
    originalPrice: 24990000,
    image: '/images/products/pixel-8-pro.jpg',
    discount: 8,
    installment: 'Trả góp 0%',
    tags: ['6.7 inches', '256 GB'],
    smember: 23000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng đồng hồ Pixel Watch 2 trị giá 8 triệu',
    rating: 4.5,
    ratingCount: 90,
    liked: false,
    promo: 'Yêu thích',
    stars: 4
  },
  {
    id: 7,
    name: 'OnePlus 12',
    price: 19990000,
    originalPrice: 21990000,
    image: '/images/products/oneplus-12.jpg',
    discount: 10,
    installment: 'Trả góp 0%',
    tags: ['6.8 inches', '256 GB'],
    smember: 20000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng tai nghe OnePlus Buds Pro 2',
    rating: 4,
    ratingCount: 60,
    liked: false,
    promo: 'Yêu thích',
    stars: 4
  },
  {
    id: 8,
    name: 'Realme GT5 Pro',
    price: 16990000,
    originalPrice: 18990000,
    image: '/images/products/realme-gt5.jpg',
    discount: 11,
    installment: 'Trả góp 0%',
    tags: ['6.8 inches', '256 GB'],
    smember: 17000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Giảm 1.000.000đ khi thanh toán qua VNPAY',
    rating: 3.5,
    ratingCount: 40,
    liked: false,
    promo: 'Yêu thích',
    stars: 3
  },
  {
    id: 9,
    name: 'Nothing Phone (2)',
    price: 15990000,
    originalPrice: 16990000,
    image: '/images/products/nothing-phone-2.jpg',
    discount: 6,
    installment: 'Trả góp 0%',
    tags: ['6.7 inches', '256 GB'],
    smember: 16000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng ốp lưng chính hãng trị giá 790.000đ',
    rating: 3,
    ratingCount: 30,
    liked: false,
    promo: 'Yêu thích',
    stars: 3
  },
  {
    id: 10,
    name: 'Huawei P60 Pro',
    price: 24990000,
    originalPrice: 26990000,
    image: '/images/products/huawei-p60.jpg',
    discount: 8,
    installment: 'Trả góp 0%',
    tags: ['6.7 inches', '256 GB'],
    smember: 25000000,
    smemberText: 'Smember giảm thêm đến',
    description: 'Tặng Watch GT4 trị giá 6.990.000đ',
    rating: 4,
    ratingCount: 70,
    liked: false,
    promo: 'Yêu thích',
    stars: 4
  }
];

const ProductCard = ({ product }) => (
  <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 duration-200 min-h-[420px] overflow-hidden group p-3">
    {/* Badge giảm giá */}
    <span className="absolute top-0 left-0 rounded-tr-md rounded-bl-md bg-red-600 text-white text-xs font-bold px-2 py-1 z-10 select-none" style={{fontSize:'13px'}}>Giảm {product.discount}%</span>
    {/* Badge trả góp */}
    <span className="absolute top-0 right-0 rounded-tl-md rounded-br-md bg-blue-50 text-blue-700 text-[11px] font-semibold px-2 py-1 z-10 border border-blue-200 select-none" style={{fontSize:'12px'}}>{product.installment}</span>

    {/* Ảnh sản phẩm */}
    <div className="flex justify-center items-center w-full aspect-[4/5] bg-white mb-3 overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>

    {/* Tên sản phẩm */}
    <h2 className="font-semibold text-[15px] text-left leading-tight min-h-[38px] mb-1 line-clamp-2">{product.name}</h2>

    {/* Tag thông số */}
    <div className="flex flex-wrap gap-1 mb-1">
      {product.tags && product.tags.map((tag, idx) => (
        <span key={idx} className="bg-gray-50 border border-gray-300 text-gray-700 text-[11px] px-2 py-[1px] rounded font-medium">{tag}</span>
      ))}
    </div>

    {/* Giá */}
    <div className="flex items-end gap-1 mb-1">
      <span className="text-[#e83a45] font-bold text-lg leading-none">{product.price.toLocaleString()}đ</span>
      <span className="text-gray-400 line-through text-sm leading-none">{product.originalPrice.toLocaleString()}đ</span>
    </div>
    {/* Giá giảm thêm */}
    <div className="text-[13px] text-[#e83a45] font-semibold mb-1">
      {product.smemberText} <span className="font-bold">{product.smember.toLocaleString()}đ</span>
    </div>
    {/* Mô tả nhỏ */}
    <div className="text-[11px] text-gray-500 mb-1 min-h-[28px]">{product.description}</div>
    {/* Đánh giá và yêu thích */}
    <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-center gap-[2px] text-yellow-400 text-xs">
        {[...Array(product.stars)].map((_, i) => (
          <FaStar key={i} size={14} />
        ))}
        <span className="text-gray-500 text-xs ml-1">({product.ratingCount})</span>
      </div>
      <button className="border border-gray-300 rounded-full p-1 text-gray-400 hover:text-red-500 hover:border-red-400 transition-colors">
        <FaRegHeart size={16} />
      </button>
    </div>
  </div>
);

const ProductListPage = () => {
  return (
    <div className="product-list-page min-h-screen bg-[#f5f6fa]">
      <Header />
      <div className="max-w-[1500px] mx-auto px-2 py-8">
        <h1 className="text-2xl font-bold mb-6 text-left">Danh sách điện thoại</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {phoneProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
