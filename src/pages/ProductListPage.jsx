import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

export default function ProductListPage() {
  const { category } = useParams(); // slug, ví dụ: 'laptop', 'dien-thoai', ...
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:3001/products');
        if (!res.ok) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo category slug nếu có
  const filteredProducts = category
    ? products.filter(product => product.category === category)
    : products;

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {category ? `Danh mục: ${category.replace(/-/g, ' ')}` : 'Danh sách sản phẩm'}
        </h1>
        {loading ? (
          <div className="text-center text-gray-500 text-lg py-10">Đang tải sản phẩm...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-lg py-10">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">Không tìm thấy sản phẩm phù hợp.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="transition-transform duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-2xl"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="bg-white rounded-2xl shadow p-3 relative flex flex-col cursor-pointer h-full">
                  {/* Ảnh sản phẩm */}
                  <img src={product.image} alt={product.name} className="w-full h-32 object-contain mb-2 rounded-xl bg-gray-100" />
                  {/* Tên sản phẩm */}
                  <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">{product.name}</div>
                  {/* Giá */}
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-lg font-bold text-red-600">{product.price?.toLocaleString()}đ</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 