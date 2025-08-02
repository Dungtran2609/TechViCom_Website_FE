import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilter, FaNewspaper, FaCalendarAlt, FaUser, FaEye, FaTag } from 'react-icons/fa';

// Giả định file index trong '.../../api' export các module API
import { newsAPI } from '../../api';

/**
 * Trang hiển thị danh sách các bài viết thuộc về một danh mục cụ thể.
 */
const CategoryNewsPage = () => {
  // === HOOKS ===
  const { categoryId } = useParams();
  const navigate = useNavigate();

  // === STATE ===
  const [newsList, setNewsList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === DATA FETCHING ===
  useEffect(() => {
    // AbortController giúp hủy các request API khi component bị unmount
    const controller = new AbortController();
    const { signal } = controller;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Tải đồng thời danh sách tin tức của danh mục và danh sách tất cả các danh mục
        const [newsResponse, categoriesResponse] = await Promise.all([
          newsAPI.getNewsByCategory(categoryId, { signal }),
          newsAPI.getCategories({ signal })
        ]);

        const categoriesData = categoriesResponse.data || [];
        setAllCategories(categoriesData);

        // Tìm thông tin của danh mục hiện tại từ danh sách đã tải
        const foundCategory = categoriesData.find(cat => cat.category_id == categoryId);
        
        if (!foundCategory) {
          setError('Danh mục không tồn tại hoặc đã bị xóa.');
          setNewsList([]);
          setCurrentCategory(null);
          return; // Dừng thực thi nếu không tìm thấy danh mục
        }
        
        setCurrentCategory(foundCategory);
        setNewsList(newsResponse.data || []);

      } catch (err) {
        if (err.name === 'AbortError') return; // Bỏ qua nếu request bị hủy
        
        console.error('Lỗi khi tải dữ liệu:', err);
        setError('Không thể tải được dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();

    // Cleanup function: Hủy request khi component unmount
    return () => {
      controller.abort();
    };
  }, [categoryId]); // Chạy lại useEffect mỗi khi categoryId trên URL thay đổi

  // === MEMOIZED VALUES ===
  // Lọc ra các danh mục khác để hiển thị ở sidebar
  const otherCategories = useMemo(() => {
    return allCategories.filter(cat => cat.category_id != categoryId);
  }, [allCategories, categoryId]);

  // === RENDER LOGIC ===

  // Component hiển thị khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  // Component hiển thị khi có lỗi
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-4 pt-28">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <FaNewspaper className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
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
        {/* Header & Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-orange-600 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/news" className="hover:text-orange-600 transition-colors">Tin tức</Link>
            <span>/</span>
            <span className="font-medium text-gray-700">{currentCategory?.name}</span>
          </nav>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaTag className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-600">DANH MỤC</p>
                <h1 className="text-3xl font-bold text-gray-800">
                  {currentCategory?.name}
                </h1>
                {currentCategory?.description && (
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {currentCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Danh sách bài viết */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Bài viết trong danh mục
                </h2>
                <div className="text-sm text-gray-500">
                    {newsList.length} bài viết
                </div>
            </div>

            {newsList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  Chưa có bài viết nào trong danh mục này.
                </p>
                <Link to="/news" className="text-orange-600 hover:text-orange-700 underline">
                  Xem tất cả bài viết
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {newsList.map((news) => (
                  <div
                    key={news.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1"
                  >
                    <Link to={`/news/${news.id}`} className="relative overflow-hidden block">
                      <img
                        src={`http://localhost:8000/${news.image}` || '/images/news/anhbv1.jpg'}
                        alt={news.title}
                        className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = '/images/news/anhbv1.jpg'; }}
                      />
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5"><FaCalendarAlt /> <span>{news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : 'Chưa có ngày'}</span></div>
                        <div className="flex items-center gap-1.5"><FaUser /> <span>{news.author?.name || 'Ẩn danh'}</span></div>
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        <Link to={`/news/${news.id}`}>{news.title}</Link>
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                        {news.content ? news.content.replace(/<[^>]+>/g, '').slice(0, 100) + '...' : 'Không có mô tả'}
                      </p>
                      <Link 
                        to={`/news/${news.id}`} 
                        className="inline-flex items-center justify-center gap-2 mt-auto px-4 py-2 bg-orange-500 text-white rounded-lg font-medium text-sm transition-colors hover:bg-orange-600"
                      >
                        <FaEye /> Đọc tiếp
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaFilter className="text-orange-500" />
                Danh mục khác
              </h3>
              <div className="space-y-2">
                <Link
                  to="/news"
                  className="block w-full text-left px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-orange-700"
                >
                  Tất cả bài viết
                </Link>
                {otherCategories.map((cat) => (
                  <Link
                    key={cat.category_id}
                    to={`/news/category/${cat.category_id}`}
                    className="block w-full text-left px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-orange-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CategoryNewsPage;