import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Dữ liệu từ HomePage
const products = [
  {
    id: 1,
    name: 'TCL 60R 5G 4GB 128GB',
    price: 2990000,
    originalPrice: 3990000,
    image: '/images/products/tcl-60r.jpg',
    installment: 'Trả góp 0%',
    colors: ['black'],
    variants: [
      { storage: '128 GB', price: 2990000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 2,
    name: 'Nubia V70 Design 8GB 128GB',
    price: 2790000,
    originalPrice: 3990000,
    image: '/images/products/nubia-v70.jpg',
    installment: 'Trả góp 0%',
    colors: ['black', 'blue', 'purple'],
    variants: [
      { storage: '128 GB', price: 2790000 },
      { storage: '256 GB', price: 3290000 }
    ],
    promotion: 'Cho thẻ HD Bank: Giảm 500.000đ đơn từ 5 triệu'
  },
  {
    id: 3,
    name: 'Xiaomi Poco M7 Pro 5G 8GB 256GB',
    price: 5990000,
    originalPrice: 6990000,
    image: '/images/products/poco-m7.jpg',
    installment: 'Trả góp 0%',
    colors: ['green', 'black', 'blue'],
    variants: [
      { storage: '256 GB', price: 5990000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 4,
    name: 'Samsung Galaxy M55 5G 256GB',
    price: 7390000,
    originalPrice: 8490000,
    image: '/images/products/samsung-m55.jpg',
    installment: 'Trả góp 0%',
    colors: ['black'],
    variants: [
      { storage: '256 GB', price: 7390000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  },
  {
    id: 5,
    name: 'Honor X9c 5G 12GB 256GB',
    price: 8790000,
    originalPrice: 9490000,
    image: '/images/products/honor-x9c.jpg',
    installment: 'Trả góp 0%',
    colors: ['pink', 'black', 'gray'],
    variants: [
      { storage: '256 GB', price: 8790000 }
    ],
    promotion: 'Cho thẻ Home Credit: Giảm 400.000đ cho hóa đơn từ 8 triệu'
  }
];

const recommendedProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    price: 31990000,
    originalPrice: 34990000,
    image: '/images/products/iphone-15-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'blue'],
    promotion: 'Giảm thêm 3.000.000đ khi thanh toán qua VNPay'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 5G',
    price: 29990000,
    originalPrice: 31990000,
    image: '/images/products/samsung-s24.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'gray', 'purple'],
    promotion: 'Thu cũ đổi mới trợ giá đến 5 triệu'
  },
  {
    id: 3,
    name: 'OPPO Find X7 Ultra',
    price: 25990000,
    originalPrice: 27990000,
    image: '/images/products/oppo-find-x7.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['black', 'blue'],
    promotion: 'Tặng tai nghe Enco Air3 Pro trị giá 2 triệu'
  },
  {
    id: 4,
    name: 'Xiaomi 14 Pro',
    price: 23990000,
    originalPrice: 24990000,
    image: '/images/products/xiaomi-14-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'white'],
    promotion: 'Giảm 2.000.000đ khi thanh toán online'
  },
  {
    id: 5,
    name: 'Vivo V29e 5G',
    price: 8990000,
    originalPrice: 9990000,
    image: '/images/products/vivo-v29e.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['blue', 'yellow'],
    promotion: 'Tặng PMH 500.000đ mua kèm phụ kiện'
  },
  {
    id: 6,
    name: 'Google Pixel 8 Pro',
    price: 22990000,
    originalPrice: 24990000,
    image: '/images/products/pixel-8-pro.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'blue'],
    promotion: 'Tặng đồng hồ Pixel Watch 2 trị giá 8 triệu'
  },
  {
    id: 7,
    name: 'OnePlus 12',
    price: 19990000,
    originalPrice: 21990000,
    image: '/images/products/oneplus-12.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['green', 'black'],
    promotion: 'Tặng tai nghe OnePlus Buds Pro 2'
  },
  {
    id: 8,
    name: 'Realme GT5 Pro',
    price: 16990000,
    originalPrice: 18990000,
    image: '/images/products/realme-gt5.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['red', 'blue'],
    promotion: 'Giảm 1.000.000đ khi thanh toán qua VNPAY'
  },
  {
    id: 9,
    name: 'Nothing Phone (2)',
    price: 15990000,
    originalPrice: 16990000,
    image: '/images/products/nothing-phone-2.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB'],
    colors: ['white', 'black'],
    promotion: 'Tặng ốp lưng chính hãng trị giá 790.000đ'
  },
  {
    id: 10,
    name: 'Huawei P60 Pro',
    price: 24990000,
    originalPrice: 26990000,
    image: '/images/products/huawei-p60.jpg',
    installment: 'Trả góp 0%',
    storage: ['256 GB', '512 GB'],
    colors: ['black', 'purple'],
    promotion: 'Tặng Watch GT4 trị giá 6.990.000đ'
  }
];

// Kết hợp tất cả sản phẩm
const allProducts = [...products, ...recommendedProducts];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductListPage() {
  const query = useQuery();
  const searchTerm = query.get('q')?.toLowerCase() || '';
  const filteredProducts = searchTerm
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchTerm))
    : allProducts;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {searchTerm ? `Kết quả tìm kiếm cho "${query.get('q')}"` : 'Danh sách điện thoại'}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg py-10">Không tìm thấy sản phẩm phù hợp.</div>
          ) : (
            filteredProducts.map(product => {
              const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              const tags = product.variants ? product.variants.map(v => v.storage) : (product.storage || []);
              
              return (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="transition-transform duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-2xl"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="bg-white rounded-2xl shadow p-3 relative flex flex-col cursor-pointer h-full">
                    {/* Badge giảm giá */}
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      Giảm {discount}%
                    </div>
                    {/* Badge trả góp */}
                    <div className="absolute top-2 right-2 bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded z-10">
                      {product.installment}
                    </div>
                    {/* Ảnh sản phẩm */}
                    <img src={product.image} alt={product.name} className="w-full h-32 object-contain mb-2 rounded-xl bg-gray-100" />
                    {/* Tên sản phẩm */}
                    <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">{product.name}</div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-1">
                      {tags && tags.map(tag => (
                        <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">{tag}</span>
                      ))}
                    </div>
                    {/* Giá */}
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-lg font-bold text-red-600">{product.price.toLocaleString()}đ</span>
                      <span className="text-xs line-through text-gray-400">{product.originalPrice.toLocaleString()}đ</span>
                    </div>
                    {/* Badge khuyến mãi */}
                    {product.promotion && (
                      <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded mb-2">
                        {product.promotion}
                      </div>
                    )}
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(120)</span>
                    </div>
                    {/* Nút yêu thích */}
                    <button className="absolute top-2 right-8 text-gray-400 hover:text-red-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 