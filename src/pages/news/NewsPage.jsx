import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaNewspaper, FaCalendarAlt, FaUser, FaEye } from 'react-icons/fa';

// SỬA LỖI QUAN TRỌNG: Đã sửa đường dẫn import.
// Từ `src/pages/news/`, chúng ta cần đi lên 2 cấp (`../../`) để đến thư mục `src`,
// sau đó mới đi vào `api/modules/`.
import { newsAPI } from '../../api/modules/newsAPI';

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // Sử dụng useMemo để tính toán category ID chỉ khi searchParams thay đổi
  const selectedCategoryId = useMemo(() => {
    const id = searchParams.get('category');
    return id ? parseInt(id, 10) : null;
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load đồng thời cả tin tức và danh mục để tối ưu tốc độ
        const [newsResponse, categoriesResponse] = await Promise.all([
          newsAPI.getNews(),
          newsAPI.getCategories()
        ]);
        
        // Kiểm tra và gán dữ liệu, phòng trường hợp API trả về null
        setNewsList(newsResponse.data || []);
        setCategories(categoriesResponse.data || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần duy nhất

  // Lọc tin tức phía client dựa trên category đã chọn
  const filteredNews = useMemo(() => {
    if (!selectedCategoryId) {
      return newsList; // Nếu không chọn category nào, hiển thị tất cả
    }
    return newsList.filter(news => news.category_id === selectedCategoryId);
  }, [newsList, selectedCategoryId]);

  // Hàm tiện ích để lấy tên category từ ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.category_id === categoryId);
    return category ? category.name : 'Chưa phân loại';
  };

  // Hàm xử lý khi click vào một category
  const handleCategoryClick = (categoryId) => {
    // Cập nhật URL search param, React Router sẽ tự động re-render
    setSearchParams(categoryId ? { category: categoryId } : {});
  };

  // Component hiển thị khi đang tải dữ liệu
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

  // Component hiển thị khi có lỗi xảy ra
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
          {/* Main Content - Nội dung chính */}
          <div className="flex-1">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FaFilter className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  {selectedCategoryId 
                    ? `Danh mục: ${getCategoryName(selectedCategoryId)}` 
                    : 'Tất cả bài viết'
                  }
                </h2>
                {selectedCategoryId && (
                  <button
                    onClick={() => handleCategoryClick(null)}
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

            {/* Lưới tin tức */}
            {filteredNews.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <FaNewspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">
                  {selectedCategoryId ? 'Không có bài viết nào trong danh mục này' : 'Chưa có bài viết nào'}
                </p>
                {selectedCategoryId && (
                  <button
                    onClick={() => handleCategoryClick(null)}
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
                    <Link to={`/news/${news.id}`} className="relative overflow-hidden block">
                      <img
                        src={`http://localhost:8000/${news.image}` || '/images/news/anhbv1.jpg'}
                        alt={news.title}
                        className="h-48 w-full object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = '/images/news/anhbv1.jpg'; }}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {getCategoryName(news.category_id)}
                        </span>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1"><FaCalendarAlt /> <span>{news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN') : 'Chưa có ngày'}</span></div>
                        <div className="flex items-center gap-1"><FaUser /> <span>{news.author?.name || 'Ẩn danh'}</span></div>
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
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaFilter className="text-orange-500" />
                Danh mục
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!selectedCategoryId ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Tất cả bài viết ({newsList.length})
                </button>
                {categories.map((category) => {
                   const count = newsList.filter(news => news.category_id === category.category_id).length;
                   return (
                     <div key={category.category_id} className="flex items-center justify-between">
                       <button
                         onClick={() => handleCategoryClick(category.category_id)}
                         className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${selectedCategoryId === category.category_id ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                       >
                         {category.name} ({count})
                       </button>
                     </div>
                   );
                 })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;