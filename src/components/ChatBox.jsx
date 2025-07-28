import React, { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission here
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div 
        className="fixed bottom-24 right-4 md:right-8 z-50 cursor-pointer transition-all duration-300 hover:scale-110"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 text-white hover:-translate-y-1 hover:scale-105">
          <FaComments size={20} className="md:text-2xl" />
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed right-2 md:right-8 bottom-32 md:bottom-40 z-50 w-[calc(100vw-1rem)] md:w-80 max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="bg-orange-500 text-white px-4 py-3 font-bold text-lg flex items-center justify-between">
            <span>Hỗ trợ trực tuyến</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white text-lg cursor-pointer hover:bg-orange-600 rounded-full p-1 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="px-4 py-4 min-h-[120px] max-h-80 overflow-y-auto text-sm text-gray-800">
            Xin chào! Bạn cần Techvicom hỗ trợ gì ạ?
          </div>
          <form 
            className="px-3 py-3 border-t border-gray-200 flex gap-2 bg-gray-50"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox; 