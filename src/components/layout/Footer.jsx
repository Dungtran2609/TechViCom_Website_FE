import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaComments, FaFacebookF, FaYoutube, FaTiktok, FaInstagram, FaComment } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) {
      alert('Cảm ơn bạn đã đăng ký nhận thông tin!');
      setEmail('');
    } else {
      alert('Vui lòng nhập email hợp lệ!');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-best">
      <div className="footer-best-newsletter">
        <div className="footer-best-newsletter-inner">
          <h3>Nhận ưu đãi & tin mới</h3>
          <form className="footer-best-newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" aria-label="Đăng ký nhận tin">
              <span>Đăng ký</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 10h14m0 0l-5-5m5 5l-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="footer-best-main">
        <div className="footer-best-main-grid">
          {/* Cột 1: Logo */}
          <div className="footer-best-col logo-col">
            <img src="/src/image/logo.png" alt="Techvicom" className="footer-best-logo" />
            <div className="footer-best-brand">Techvicom</div>
            <div className="footer-best-slogan">Công nghệ cho mọi nhà - Giá tốt mỗi ngày</div>
            <div className="footer-best-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-best-social facebook" title="Facebook" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-best-social youtube" title="YouTube" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-best-social tiktok" title="TikTok" aria-label="TikTok"><FaTiktok /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-best-social instagram" title="Instagram" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="footer-best-social zalo" title="Zalo" aria-label="Zalo"><FaComment /></a>
            </div>
          </div>

          {/* Cột 2: Dịch vụ khách hàng */}
          <div className="footer-best-col">
            <h4>Dịch vụ khách hàng</h4>
            <ul>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><Link to="/policy">Chính sách bảo hành</Link></li>
              <li><Link to="/policy">Chính sách đổi trả</Link></li>
              <li><Link to="/policy">Chính sách vận chuyển</Link></li>
              <li><a href="#">Chính sách trả góp</a></li>
              <li><a href="#">Tra cứu bảo hành</a></li>
              <li><a href="#">Tra cứu hóa đơn</a></li>
            </ul>
          </div>

          {/* Cột 3: Về Techvicom */}
          <div className="footer-best-col">
            <h4>Về Techvicom</h4>
            <ul>
              <li><Link to="/about">Giới thiệu công ty</Link></li>
              <li><Link to="/news">Tin tức & sự kiện</Link></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Hệ thống cửa hàng</a></li>
              <li><a href="#">Đại lý ủy quyền</a></li>
              <li><a href="#">Dự án doanh nghiệp</a></li>
            </ul>
          </div>

          {/* Cột 4: Bản đồ */}
          <div className="footer-best-col">
            <h4>Vị trí của chúng tôi</h4>
            <div className="footer-map-wrapper">
              <iframe
                title="Bản đồ vị trí Techvicom"
                // ĐẢM BẢO ĐƯỜNG DẪN SRC NÀY LÀ CHÍNH XÁC
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863806021138!2d105.74468151118364!3d21.03813478737505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1753537277135!5m2!1svi!2s"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="footer-map-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Phần dưới cùng và các nút */}
      <div className="footer-best-bottom">
        <div className="footer-best-bottom-inner">
          <span>© {new Date().getFullYear()} Techvicom. All rights reserved.</span>
        </div>
      </div>
      
      <button
        className={`footer-best-backtotop${showBackToTop ? ' show' : ''}`}
        onClick={scrollToTop}
        aria-label="Quay lại đầu trang"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 19V5M12 5l-7 7m7-7l7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      
      <button
        className="footer-chatbox-btn"
        onClick={()=>setShowChat(v=>!v)}
        aria-label="Chat hỗ trợ"
      >
        <FaComments />
      </button>

      {showChat && (
        <div className="footer-chatbox-window">
          <div className="chatbox-header">
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={()=>setShowChat(false)}>×</button>
          </div>
          <div className="chatbox-body">
            Xin chào! Bạn cần Techvicom hỗ trợ gì ạ?
          </div>
          <div className="chatbox-input-area">
            <input type="text" placeholder="Nhập tin nhắn..." />
            <button>Gửi</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;