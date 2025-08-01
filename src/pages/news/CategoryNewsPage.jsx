import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilter, FaNewspaper, FaCalendarAlt, FaUser, FaEye, FaTag } from 'react-icons/fa';
import { newsAPI } from '../../api';

const CategoryNewsPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories
        const categoriesResponse = await newsAPI.getCategories();
        setCategories(categoriesResponse.data || []);
        
        // Find current category
        const currentCategory = categoriesResponse.data?.find(cat => cat.category_id == categoryId);
        setCategory(currentCategory);
        
        if (!currentCategory) {
          setError('Danh mục không tồn tại');
          return;
        }
        
        // Load news by category
        const newsResponse = await newsAPI.getNewsByCategory(categoryId);
        setNewsList(newsResponse.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [categoryId]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id == categoryId);
    return category ? category.name : 'Chưa phân loại';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <FaNewspaper className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/news')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Quay lại trang tin tức
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-orange-600 transition-colors">
              Trang chủ
            </Link>
            <span>→</span>
            <Link to="/news" className="hover:text-orange-600 transition-colors">
              Tin tức
            </Link>
            <span>→</span>
            <span className="text-orange-600 font-medium">{category?.name}</span>
          </nav>
          
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            Quay lại trang tin tức
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaTag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {category?.name}
                </h1>
                <p className="text-gray-600">
                  {newsList.length} bài viết trong danh mục này
                </p>
              </div>
            </div>
            
            {category?.description && (
              <p className="text-gray-700 leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* News Grid */}
            {newsList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  Chưa có bài viết nào trong danh mục này
                </p>
                <Link
                  to="/news"
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Xem tất cả bài viết
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:8000/${news.image}` || '/images/news/anhbv1.jpg'}
                        alt={news.title}
                        className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/images/news/anhbv1.jpg';
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {category?.name}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3" />
                          <span>
                            {news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaUser className="w-3 h-3" />
                          <span>{news.author?.name || 'Ẩn danh'}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {news.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                        {news.content ? news.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...' : 'Không có mô tả'}
                      </p>

                      {/* Read More Button */}
                      <Link 
                        to={`/news/${news.id}`} 
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-orange-600 hover:shadow-md group-hover:scale-105"
                      >
                        <FaEye className="w-3 h-3" />
                        Đọc tiếp
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFilter className="text-orange-500" />
                  Danh mục khác
                </h3>
                <div className="space-y-2">
                  <Link
                    to="/news"
                    className="block w-full text-left px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50"
                  >
                    Tất cả bài viết
                  </Link>
                  {categories.map((cat) => {
                    if (cat.category_id == categoryId) return null;
                    return (
                      <Link
                        key={cat.category_id}
                        to={`/news/category/${cat.category_id}`}
                        className="block w-full text-left px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 hover:text-orange-600"
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Category Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin danh mục</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Tên danh mục</p>
                    <p className="font-medium text-gray-800">{category?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số bài viết</p>
                    <p className="font-medium text-gray-800">{newsList.length} bài</p>
                  </div>
                  {category?.description && (
                    <div>
                      <p className="text-sm text-gray-500">Mô tả</p>
                      <p className="text-sm text-gray-700">{category.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewsPage; 