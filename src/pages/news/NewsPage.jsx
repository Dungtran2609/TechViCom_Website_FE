import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaNewspaper, FaCalendarAlt, FaUser, FaEye } from 'react-icons/fa';
import { newsAPI } from '../../api';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load categories
        const categoriesResponse = await newsAPI.getCategories();
        setCategories(categoriesResponse.data || []);
        
        // Load news
        const newsResponse = await newsAPI.getNews();
        setNewsList(newsResponse.data || []);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter news by category
  const filteredNews = selectedCategory 
    ? newsList.filter(news => news.category_id === selectedCategory)
    : newsList;

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    if (categoryId === selectedCategory) {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId);
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
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4 text-center text-orange-600 tracking-tight drop-shadow">
            Tin tức nổi bật
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Khám phá những bài viết mới nhất và thú vị nhất từ TechViCom
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FaFilter className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedCategory 
                    ? `Danh mục: ${getCategoryName(selectedCategory)}` 
                    : 'Tất cả bài viết'
                  }
                </h2>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="text-sm text-orange-600 hover:text-orange-700 underline"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {filteredNews.length} bài viết
              </div>
            </div>

            {/* News Grid */}
            {filteredNews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  {selectedCategory ? 'Không có bài viết nào trong danh mục này' : 'Chưa có bài viết nào'}
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    Xem tất cả bài viết
                  </button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredNews.map((news) => (
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
                          {getCategoryName(news.category_id)}
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
                  Danh mục
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory 
                        ? 'bg-orange-100 text-orange-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Tất cả bài viết ({newsList.length})
                  </button>
                                     {categories.map((category) => {
                     const count = newsList.filter(news => news.category_id === category.category_id).length;
                     return (
                       <div key={category.category_id} className="flex items-center justify-between">
                         <button
                           onClick={() => handleCategoryClick(category.category_id)}
                           className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                             selectedCategory === category.category_id 
                               ? 'bg-orange-100 text-orange-700 font-medium' 
                               : 'text-gray-600 hover:bg-gray-50'
                           }`}
                         >
                           {category.name} ({count})
                         </button>
                         <Link
                           to={`/news/category/${category.category_id}`}
                           className="px-2 py-1 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors"
                           title="Xem tất cả bài viết trong danh mục"
                         >
                           →
                         </Link>
                       </div>
                     );
                   })}
                </div>
              </div>

              {/* Popular Articles */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Bài viết nổi bật</h3>
                <div className="space-y-4">
                  {newsList.slice(0, 3).map((news) => (
                    <Link
                      key={news.id}
                      to={`/news/${news.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <img
                          src={`http://localhost:8000/${news.image}` || '/images/news/anhbv1.jpg'}
                          alt={news.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/images/news/anhbv1.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {news.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : 'Chưa có ngày'}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 