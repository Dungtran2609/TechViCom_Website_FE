import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/news/${id}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-lg">Đang tải bài viết...</div>;
  if (!news) return <div className="text-center py-20 text-lg text-red-500">Không tìm thấy bài viết!</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-10 md:mt-16">
      <div className="bg-white rounded-2xl shadow p-6">
        {news.thumbnail && (
          <img src={news.thumbnail} alt={news.title} className="w-full h-80 object-cover rounded-xl mb-8 mx-auto" />
        )}
        <h1 className="text-3xl font-bold text-orange-600 mb-2 text-center">{news.title}</h1>
        <div className="text-gray-400 text-sm mb-6 text-center">Ngày đăng: {news.date}</div>
        <div className="text-lg text-gray-800 leading-relaxed md:text-left prose prose-orange max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>
    </div>
  );
};

export default NewsDetailPage; 