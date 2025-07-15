import React from 'react';
import { newsList } from '../data/news';
import { Link } from 'react-router-dom';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-12 px-2 pt-28">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-12 text-center text-orange-600 tracking-tight drop-shadow">Tin tức nổi bật</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {newsList.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-3xl shadow-lg border border-orange-100 flex flex-col overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:border-orange-500 hover:-translate-y-2 hover:scale-105 min-h-[520px] min-w-0 w-full"
            >
              <div className="overflow-hidden">
                <img
                  src={news.thumbnail || news.image}
                  alt={news.title}
                  className="h-72 w-full object-cover rounded-t-3xl transition-all duration-300 group-hover:scale-110 group-hover:brightness-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-gray-400 text-xs mb-2 text-right">{news.date && (new Date(news.date).toLocaleDateString('vi-VN'))}</div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 transition-colors duration-300 group-hover:text-orange-600 line-clamp-2">
                  {news.title}
                </h2>
                <p className="text-gray-600 mb-6 flex-1 line-clamp-3">{news.description || (news.content && news.content.replace(/<[^>]+>/g, '').slice(0, 120) + '...')}</p>
                <Link to={`/news/${news.id}`} className="inline-flex items-center justify-center gap-2 mt-auto px-5 py-2.5 bg-orange-500 text-white rounded-full font-semibold shadow transition-all duration-200 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 w-full text-lg">
                  → Xem bài viết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage; 