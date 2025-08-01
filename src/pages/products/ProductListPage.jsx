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
        // Gọi API, có thể truyền params cho phân trang nếu cần
        const response = await productAPI.getProducts();
        // Nếu là Laravel paginate thì response.data.data là mảng sản phẩm
        const products = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setProducts(products);
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

  // Lấy danh sách brand duy nhất từ products (brand là object)
  const brands = Array.from(
    new Set(
      products
        .map(p => p.brand?.slug && p.brand?.name ? JSON.stringify({slug: p.brand.slug, name: p.brand.name}) : null)
        .filter(Boolean)
    )
  ).map(str => JSON.parse(str));

  // Lọc sản phẩm theo category.slug và brand.slug nếu có
  const filteredProducts = products.filter(product => {
    let match = true;
    if (category) match = match && product.category?.slug === category;
    if (selectedBrand) match = match && product.brand?.slug === selectedBrand;
    return match;
  });

  // Hàm xử lý khi chọn brand
  const handleBrandSelect = (brandSlug) => {
    setSelectedBrand(brandSlug);
    if (brandSlug) {
      setSearchParams({ brand: brandSlug });
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
                key={brand.slug}
                className={`px-3 py-1 rounded border ${selectedBrand === brand.slug ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'}`}
                onClick={() => handleBrandSelect(brand.slug)}
              >{brand.name}</button>
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
              (() => {
                // Sửa logic lấy giá biến thể: bỏ giá trị nhỏ bất thường (ví dụ < 1000)
                const getPriceStr = (val) => {
                  if (val === undefined || val === null) return '';
                  const str = val.toString();
                  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
                let minPrice, maxPrice;
                if (Array.isArray(product.variants) && product.variants.length > 0) {
                  // Chỉ lấy giá trị hợp lý (>= 1000)
                  const prices = product.variants.map(v => {
                    let price = v.sale_price !== undefined && v.sale_price !== null && v.sale_price !== '' ? Number(v.sale_price) : Number(v.price);
                    return price >= 1000 ? price : null;
                  }).filter(p => p !== null && !isNaN(p));
                  if (prices.length > 0) {
                    minPrice = Math.min(...prices);
                    maxPrice = Math.max(...prices);
                  }
                }
                return (
                  <Link
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="transition-transform duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-2xl"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="bg-white rounded-2xl shadow p-3 relative flex flex-col cursor-pointer h-full">
                  {/* Ảnh sản phẩm */}
                  <img
                    src={
                      product.thumbnail
                        ? product.thumbnail.startsWith('http')
                          ? product.thumbnail
                          : `http://localhost:8000/storage/${product.thumbnail.replace(/^storage[\\/]/, '')}`
                        : '/images/no-image.png'
                    }
                    alt={product.name}
                    className="w-full h-32 object-contain mb-2 rounded-xl bg-gray-100"
                  />
                  {/* Tên sản phẩm */}
                  <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[40px]">{product.name}</div>
                  {/* Giá */}
                  <div className="flex flex-col gap-1 mb-1">
                    {/* Hiển thị giá tổng (min-max) */}
                    {Array.isArray(product.variants) && product.variants.length > 0 && minPrice !== undefined && maxPrice !== undefined ? (
                      <span className="text-lg font-bold text-red-600">Giá từ {getPriceStr(minPrice)}đ - {getPriceStr(maxPrice)}đ</span>
                    ) : (
                      product.sale_price && Number(product.sale_price) < Number(product.price) ? (
                        <>
                          <span className="text-lg font-bold text-red-600">{product.sale_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</span>
                          <span className="text-base line-through text-gray-500 ml-2">{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-red-600">{product.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}đ</span>
                      )
                    )}
                    {/* Hiển thị giá từng biến thể */}
                    {Array.isArray(product.variants) && product.variants.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {product.variants.map((v, idx) => {
                          const price = v.sale_price !== undefined && v.sale_price !== null && v.sale_price !== '' ? Number(v.sale_price) : Number(v.price);
                          if (price < 1000 || isNaN(price)) return null;
                          return (
                            <div key={idx}>
                              {v.name ? <span className="font-medium">{v.name}: </span> : null}
                              <span>{getPriceStr(price)}đ</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Thương hiệu */}
                  {product.brand?.name && (
                    <div className="text-xs text-gray-500">{product.brand.name}</div>
                  )}
                </div>
              </Link>
                );
              })()
            ))}
          </div>
        )}
      </div>
    </div>
  );
}