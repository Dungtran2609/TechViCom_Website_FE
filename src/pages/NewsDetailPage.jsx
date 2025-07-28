import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import { api } from '../api';

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
  
  const currentUser = getCurrentUser();

  useEffect(() => {
    setLoading(true);
    api.news.getById(id)
      .then(data => {
        setNews(data);
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setNews(null);
        setLoading(false);
      });
  }, [id]);
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) {
      if (!currentUser) {
          alert("Vui lòng đăng nhập để bình luận.");
          navigate('/login');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    const commentData = {
      id: Date.now(),
      author: currentUser.name,
      avatar: currentUser.avatar || '/images/avatar-default.png',
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    const previousComments = comments;
    const updatedComments = [...comments, commentData];
    
    setComments(updatedComments);
    setNewComment('');

    try {
      const updatedNews = await api.news.update(id, { comments: updatedComments });
      setNews(updatedNews);
      
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Đã xảy ra lỗi khi gửi bình luận của bạn. Vui lòng thử lại.");
      setComments(previousComments);
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
    return [...comments].reverse();
  }, [comments]);


  if (loading) return <div className="text-center py-20 text-lg">Đang tải bài viết...</div>;
  if (!news) return <div className="text-center py-20 text-lg text-red-500">Không tìm thấy bài viết!</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 md:mt-16">
      {/* Phần nội dung bài viết giữ nguyên */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
        {news.thumbnail && (
          <img src={news.thumbnail} alt={news.title} className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8 mx-auto" />
        )}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{news.title}</h1>
        <div className="flex items-center text-gray-500 text-sm mb-6 border-b pb-4">
          <span>Tác giả: <strong className="text-orange-600">{news.author || 'Ẩn danh'}</strong></span>
          <span className="mx-3">|</span>
          <span>Ngày đăng: {new Date(news.date).toLocaleDateString('vi-VN')}</span>
        </div>
        <div className="text-lg text-gray-800 leading-relaxed prose prose-orange max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>

      {/* ========================================================== */}
      {/* KHU VỰC BÌNH LUẬN ĐÃ ĐƯỢC THIẾT KẾ LẠI THEO ẢNH */}
      {/* ========================================================== */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mt-8">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-8">Thảo luận ({comments.length})</h2>
        
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
            {comments.length > 0 ? (
              displayedComments.map(comment => (
                <div key={comment.id} className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={comment.avatar || '/images/avatar-default.png'}
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{comment.author}</p>
                          <p className="mt-1 text-gray-700 text-base whitespace-pre-wrap">{comment.text}</p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0 ml-4">
                          {formatCommentTime(comment.timestamp)}
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