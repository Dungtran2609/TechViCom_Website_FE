import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { productAPI } from '../../api';


export default function ProductListPage() {
  const { category } = useParams(); // slug, ví dụ: 'laptop', 'dien-thoai', ...
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const brandFromUrl = searchParams.get('brand');
  const [selectedBrand, setSelectedBrand] = useState(brandFromUrl || '');
  


  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  // Cập nhật selectedBrand khi URL thay đổi
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand');
    setSelectedBrand(brandFromUrl || '');
  }, [searchParams]);

  // Lấy danh sách brand duy nhất từ products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  // Lọc sản phẩm theo category và brand nếu có
  const filteredProducts = products.filter(product => {
    let match = true;
    if (category) match = match && product.category === category;
    if (selectedBrand) match = match && product.brand === selectedBrand;
    return match;
  });

  // Hàm xử lý khi chọn brand
  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    if (brand) {
      setSearchParams({ brand });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {category ? `Danh mục: ${category.replace(/-/g, ' ')}` : 'Danh sách sản phẩm'}
          {selectedBrand && ` - ${selectedBrand}`}
        </h1>
        {/* Bộ lọc thương hiệu */}
        {brands.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="font-medium mr-2">Thương hiệu:</span>
            <button
              className={`px-3 py-1 rounded border ${selectedBrand === '' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => handleBrandSelect('')}
            >Tất cả</button>
            {brands.map(brand => (
              <button
                key={brand}
                className={`px-3 py-1 rounded border ${selectedBrand === brand ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => handleBrandSelect(brand)}
              >{brand}</button>
            ))}
          </div>
        )}
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