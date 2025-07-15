import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsList } from '../data/news';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = newsList.find((item) => item.id === id) || newsList[0];

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