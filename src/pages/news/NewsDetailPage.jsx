import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegCommentDots, FaFacebook, FaHeart, FaLink } from 'react-icons/fa';
import { newsAPI } from '../../api/modules/newsAPI';
import { useNotificationActions } from '../../components/notificationHooks';

const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const NewsDetailPage = () => {
  const { id: newsId } = useParams();
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useNotificationActions();
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // === DATA FETCHING ===
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadNewsDetails = async () => {
      setLoading(true);
      setPageError(null);
      try {
        const response = await newsAPI.getNewsById(newsId, { signal });
        if (response.data) {
          const { data: newsData } = response;
          setNews(newsData);
          setComments(newsData.comments || []);
          setLikeCount(newsData.likes_count || 0);
          setIsLiked(newsData.is_liked_by_user || false);
        } else {
          throw new Error("Không tìm thấy dữ liệu bài viết trong phản hồi từ API.");
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setPageError("Không thể tải bài viết. Có thể bài viết không tồn tại hoặc đã bị xóa.");
        setNews(null);
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetails();
    return () => controller.abort();
  }, [newsId]);

  // === EVENT HANDLERS ===
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser) {
      showError("Vui lòng đăng nhập để bình luận.", "Yêu cầu đăng nhập");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    const previousComments = comments;

    // Optimistic Update
    const optimisticComment = {
      id: `temp-${Date.now()}`,
      content: newComment,
      created_at: new Date().toISOString(),
      user: { ...currentUser },
    };
    setComments([...comments, optimisticComment]);
    setNewComment('');

    try {
      const response = await newsAPI.addNewsComment(newsId, { content: newComment });
      setComments(prev => prev.map(c => (c.id === optimisticComment.id ? response.data : c)));
      showSuccess("Bình luận của bạn đã được gửi!", "Thành công");
    } catch (err) {
      showError("Gửi bình luận thất bại. Vui lòng thử lại.", "Lỗi");
      setComments(previousComments);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like bài viết
  const handleLike = useCallback(async () => {
    if (!currentUser) {
      showError("Vui lòng đăng nhập để thích bài viết.", "Yêu cầu đăng nhập");
      navigate('/login');
      return;
    }
    const originalIsLiked = isLiked;
    setIsLiked(!originalIsLiked);
    setLikeCount(prev => (originalIsLiked ? prev - 1 : prev + 1));
    try {
      await newsAPI.toggleLikeNews(newsId);
    } catch (err) {
      showError("Không thể cập nhật lượt thích. Vui lòng thử lại.", "Lỗi");
      setIsLiked(originalIsLiked);
      setLikeCount(prev => (originalIsLiked ? prev + 1 : prev - 1));
    }
  }, [currentUser, isLiked, navigate, newsId, showError]);

  // Like bình luận (nếu muốn mở rộng)
  const handleLikeComment = async (commentId, liked, index) => {
    if (!currentUser) {
      showError("Vui lòng đăng nhập để thích bình luận.", "Yêu cầu đăng nhập");
      navigate('/login');
      return;
    }
    setComments(prev =>
      prev.map((c, i) =>
        i === index
          ? {
            ...c,
            is_liked_by_user: !liked,
            likes_count: liked ? (c.likes_count || 1) - 1 : (c.likes_count || 0) + 1,
          }
          : c
      )
    );
    try {
      await newsAPI.toggleLikeComment(commentId);
    } catch {
      setComments(prev =>
        prev.map((c, i) =>
          i === index
            ? {
              ...c,
              is_liked_by_user: liked,
              likes_count: liked ? (c.likes_count || 0) + 1 : (c.likes_count || 1) - 1,
            }
            : c
        )
      );
      showError("Không thể cập nhật lượt thích bình luận.", "Lỗi");
    }
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(news?.title || '');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
    window.open(facebookUrl, 'facebook-share-dialog', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccess("Đã sao chép link bài viết!", "Thành công");
    } catch {
      showError("Không thể sao chép link.", "Lỗi");
    }
  };

  // === MEMOIZED VALUES & UTILITIES ===
  const displayedComments = useMemo(() => {
    // Tạo một bản sao của mảng comments để không thay đổi state gốc
    return [...comments]
      .filter(c => !c.is_hidden) // Giữ lại logic lọc các comment bị ẩn
      // Sắp xếp các bình luận: so sánh ngày tháng của b với a
      // để đưa bình luận mới hơn (ngày lớn hơn) lên trước
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [comments]);

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Vừa xong';
    return new Date(timestamp).toLocaleString('vi-VN', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (pageError || !news) {
    return (
      <div className="text-center py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Đã xảy ra lỗi</h2>
        <p className="text-gray-700">{pageError || "Không tìm thấy bài viết bạn yêu cầu."}</p>
        <Link to="/news" className="mt-6 inline-block px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Quay lại trang tin tức
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 md:mt-16">
      <div className="mb-6">
        <Link to="/news" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium transition-colors">
          ← Quay lại danh sách bài viết
        </Link>
      </div>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:rounded-3xl md:shadow-none">
        {news.image && (
          <img
            src={`http://localhost:8000/${news.image}`}
            alt={news.title}
            className="w-full h-[300px] md:h-[500px] object-contain bg-white"
            onError={(e) => { e.target.src = '/images/news/anhbv1.jpg'; }}
          />
        )}
        <div className="p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-gray-600 text-sm mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src={news.author?.avatar || '/images/avatar-default.png'} alt={news.author?.name} className="w-8 h-8 rounded-full object-cover" />
                <span>Tác giả: <strong className="text-orange-600">{news.author?.name || 'Ẩn danh'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>🗓️</span>
                <span>{new Date(news.published_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {news.category && (
                <div className="flex items-center gap-2">
                  <span>🔖</span>
                  <span>Danh mục: <strong className="text-orange-600">{news.category.name}</strong></span>
                </div>
              )}
            </div>
            <div
              className="prose prose-lg text-left text-gray-700 max-w-none mb-8 leading-relaxed "
              style={{ wordBreak: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: news.content || 'Không có nội dung' }}
            />
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors duration-200 ${isLiked ? 'text-red-500 font-semibold' : 'hover:text-red-500'}`}
                  >
                    <FaRegThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>Thích</span>
                  </button>
                  <button onClick={handleShareFacebook} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <FaFacebook className="w-5 h-5" />
                    <span className="hidden sm:inline">Chia sẻ</span>
                  </button>
                  <button onClick={handleCopyLink} className="flex items-center gap-2 hover:text-green-600 transition-colors">
                    <FaLink className="w-5 h-5" />
                    <span className="hidden sm:inline">Sao chép link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-8">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-8">Thảo luận ({displayedComments.length})</h2>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
                <img src={currentUser.avatar || '/images/avatar-default.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="w-full">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 text-base bg-gray-100 rounded-lg border border-transparent focus:bg-white focus:border-orange-400 focus:ring-0 transition-colors"
                    rows="2"
                    placeholder="Viết bình luận của bạn..."
                    required
                  />
                  <div className="mt-3 flex justify-end">
                    <button type="submit" disabled={isSubmitting || !newComment.trim()} className="px-6 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center border-2 border-dashed rounded-lg p-6 bg-gray-50">
                <p className="mb-4 text-gray-600">Bạn cần <Link to="/login" className="font-semibold text-orange-500 hover:underline">đăng nhập</Link> để tham gia thảo luận.</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {displayedComments.length > 0 ? (
              displayedComments.map((comment, idx) => (
                <div key={comment.id} className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img src={comment.user?.avatar || '/images/avatar-default.png'} alt={comment.user?.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{comment.user?.name || 'Ẩn danh'}</p>
                        <p className="mt-1 text-gray-700 text-base whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0 ml-4 pt-1">{formatDateTime(comment.created_at)}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">

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