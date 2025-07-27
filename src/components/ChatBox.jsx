import React, { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import './ChatBox.css';

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
      <div className="chat-box-button" onClick={() => setIsOpen(true)}>
        <div className="chat-box-content">
          <FaComments size={24} />
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-box-window">
          <div className="chat-box-header">
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-box-body">
            Xin chào! Bạn cần Techvicom hỗ trợ gì ạ?
          </div>
          <form className="chat-box-input-area" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Gửi</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBox; 