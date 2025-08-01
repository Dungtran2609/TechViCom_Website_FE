import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegCommentDots, FaFacebook, FaHeart } from 'react-icons/fa';
import { newsAPI } from '../../api';
import { useNotificationActions } from '../../components/notificationHooks';


const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const currentUser = getCurrentUser();
  const { error: showError, success: showSuccess } = useNotificationActions();

  useEffect(() => {
    setLoading(true);
    // Reset state khi chuyển bài viết mới
    setNews(null);
    setComments([]);
    setNewComment('');
    setIsSubmitting(false);

    const loadNews = async () => {
      try {
        const response = await newsAPI.getNewsById(id);
        const newsData = response.data;
        setNews(newsData);

        // Comments đã được load cùng với news từ backend
        setComments(newsData.comments || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setNews(null);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      if (!currentUser) {
        showError("Vui lòng đăng nhập để bình luận.", "Yêu cầu đăng nhập");
        navigate('/login');
      }
      return;
    }

    setIsSubmitting(true);

    const commentData = {
      user_id: currentUser.id,
      content: newComment,
    };

    const previousComments = comments;

    try {
      const response = await newsAPI.addNewsComment(id, commentData);
      const newCommentData = response.data;

      // Đảm bảo comment mới có is_hidden = false
      const commentWithHiddenStatus = {
        ...newCommentData,
        is_hidden: false
      };

      // Add the new comment to the list
      setComments([...comments, commentWithHiddenStatus]);
      setNewComment('');

    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      showError("Đã xảy ra lỗi khi gửi bình luận của bạn. Vui lòng thử lại.", "Lỗi bình luận");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit',
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const displayedComments = useMemo(() => {
    // Chỉ hiển thị những comment có is_hidden = false (0) hoặc không có trường is_hidden
    const visibleComments = comments.filter(comment => 
      comment.is_hidden === false || comment.is_hidden === 0 || comment.is_hidden === undefined
    );
    return [...visibleComments].reverse();
  }, [comments]);

  // Hàm xử lý like bài viết
  const handleLike = () => {
    if (!currentUser) {
      showError("Vui lòng đăng nhập để thích bài viết.", "Yêu cầu đăng nhập");
      navigate('/login');
      return;
    }

    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    if (!isLiked) {
      showSuccess("Đã thích bài viết!", "Thành công");
    }
  };

  // Hàm chia sẻ lên Facebook
  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news.title);
    const description = encodeURIComponent(news.content ? news.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...' : '');

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;

    // Mở popup Facebook share
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      facebookUrl,
      'facebook-share-dialog',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0,location=0,menubar=0,directories=0,scrollbars=0`
    );

    showSuccess("Đã mở cửa sổ chia sẻ Facebook!", "Chia sẻ");
  };

  // Hàm copy link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("Đã sao chép link bài viết!", "Thành công");
    } catch (error) {
      showError("Không thể sao chép link.", "Lỗi");
    }
  };


  if (loading) return <div className="text-center py-20 text-lg">Đang tải bài viết...</div>;
  if (!news) return <div className="text-center py-20 text-lg text-red-500">Không tìm thấy bài viết!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 md:mt-16">
      {/* Nút quay lại */}
      <div className="mb-6">
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors"
        >
          ← Quay lại danh sách bài viết
        </Link>
      </div>
      {/* Phần nội dung bài viết được thiết kế lại */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        {news.image && (
          <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
            <img
              src={`http://localhost:8000/${news.image}`}
              alt={news.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/news/anhbv1.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        )}

        {/* Content Container */}
        <div className="p-6 md:p-10">
          {/* Article Header */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-xs">
                    {news.author?.name ? news.author.name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <span>Tác giả: <strong className="text-orange-600">{news.author?.name || 'Ẩn danh'}</strong></span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{news.published_at ? new Date(news.published_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Chưa có ngày'}</span>
              </div>
              {news.category && (
                <>
                  <span className="hidden md:inline">•</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Danh mục: <strong className="text-orange-600">{news.category.name}</strong></span>
                  </div>
                </>
              )}
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-left">
              <div
                className="text-gray-800 leading-relaxed text-base md:text-lg text-left"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  lineHeight: '1.8',
                  fontSize: '1.125rem',
                  textAlign: 'left'
                }}
                dangerouslySetInnerHTML={{
                  __html: news.content
                    ? news.content
                      .replace(/<h1/g, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-4 text-left"')
                      .replace(/<h2/g, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3 text-left"')
                      .replace(/<h3/g, '<h3 class="text-xl font-bold text-gray-900 mt-5 mb-2 text-left"')
                      .replace(/<p/g, '<p class="mb-4 text-gray-700 leading-relaxed text-left"')
                      .replace(/<ul/g, '<ul class="list-disc list-inside mb-4 space-y-2 text-left"')
                      .replace(/<ol/g, '<ol class="list-decimal list-inside mb-4 space-y-2 text-left"')
                      .replace(/<li/g, '<li class="text-gray-700 text-left"')
                      .replace(/<blockquote/g, '<blockquote class="border-l-4 border-orange-500 pl-4 italic text-gray-600 my-6 text-left"')
                      .replace(/<a/g, '<a class="text-orange-600 hover:text-orange-700 underline text-left"')
                      .replace(/<strong/g, '<strong class="font-semibold text-gray-900 text-left"')
                      .replace(/<em/g, '<em class="italic text-gray-700 text-left"')
                      .replace(/<img/g, '<img class="rounded-lg shadow-md my-6 max-w-full h-auto"')
                    : 'Không có nội dung'
                }}
              />
            </div>

            {/* Article Footer */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${isLiked
                        ? 'text-red-500 hover:text-red-600'
                        : 'hover:text-orange-600'
                      }`}
                  >
                    <FaHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : 'fill-none'}`} />
                    <span>{likeCount > 0 ? likeCount : ''} Thích</span>
                  </button>

                  {/* Facebook Share Button */}
                  <button
                    onClick={handleShareFacebook}
                    className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                  >
                    <FaFacebook className="w-4 h-4" />
                    Chia sẻ Facebook
                  </button>

                  {/* Copy Link Button */}
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Sao chép link
                  </button>
                </div>

                {/* Reading Indicator */}
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Đã đọc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* KHU VỰC BÌNH LUẬN ĐÃ ĐƯỢC THIẾT KẾ LẠI THEO ẢNH */}
      {/* ========================================================== */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-8">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-8">Thảo luận ({displayedComments.length})</h2>

        <div className="max-w-4xl mx-auto">
          {/* Form gửi bình luận */}
          <div className="mb-8">
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
                <img
                  src={currentUser.avatar || '/images/avatar-default.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="w-full">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 text-base bg-slate-100 rounded-lg border border-transparent focus:bg-white focus:border-slate-300 focus:ring-0 transition-colors duration-200"
                    rows="2"
                    placeholder="Viết bình luận của bạn..."
                    required
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="px-6 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center border-2 border-dashed rounded-lg p-6 bg-slate-50">
                <p className="mb-4 text-gray-600">Bạn cần <Link to="/login" className="font-semibold text-orange-500 hover:underline">đăng nhập</Link> để tham gia thảo luận.</p>
              </div>
            )}
          </div>

          {/* Danh sách bình luận */}
          <div className="space-y-4">
            {displayedComments.length > 0 ? (
              displayedComments.map(comment => (
                <div key={comment.id} className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={comment.user?.avatar || '/images/avatar-default.png'}
                    alt={comment.user?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{comment.user?.name || 'Ẩn danh'}</p>
                        <p className="mt-1 text-gray-700 text-base whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0 ml-4">
                        {formatCommentTime(comment.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <button className="flex items-center gap-1.5 font-medium hover:text-orange-500 transition-colors">
                        <FaRegThumbsUp /> Thích
                      </button>
                      <button className="flex items-center gap-1.5 font-medium hover:text-orange-500 transition-colors">
                        <FaRegCommentDots /> Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;