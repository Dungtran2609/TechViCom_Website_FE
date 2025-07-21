import React, { useState, useEffect } from 'react';
import './Footer.css';
import { FaComments } from 'react-icons/fa';

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
    if (email.trim()) {
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
      {/* Newsletter - simple version */}
      <div className="footer-best-newsletter">
        <div className="footer-best-newsletter-inner" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'}}>
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

      {/* Main Footer */}
      <div className="footer-best-main">
        <div className="footer-best-main-grid">
          {/* Logo & Slogan */}
          <div className="footer-best-col logo-col">
            <img src="/src/image/logo.png" alt="Techvicom" className="footer-best-logo" />
            <div className="footer-best-brand">Techvicom</div>
            <div className="footer-best-slogan">Công nghệ cho mọi nhà - Giá tốt mỗi ngày</div>
            <div className="footer-best-socials">
              <a href="#" className="footer-best-social facebook" title="Facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="footer-best-social youtube" title="YouTube" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
              <a href="#" className="footer-best-social tiktok" title="TikTok" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
              <a href="#" className="footer-best-social instagram" title="Instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" className="footer-best-social zalo" title="Zalo" aria-label="Zalo"><i className="fas fa-comment"></i></a>
            </div>
          </div>

          {/* Dịch vụ khách hàng */}
          <div className="footer-best-col">
            <h4>Dịch vụ khách hàng</h4>
            <ul>
              <li><a href="#">Hướng dẫn mua hàng</a></li>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách vận chuyển</a></li>
              <li><a href="#">Chính sách trả góp</a></li>
              <li><a href="#">Tra cứu bảo hành</a></li>
              <li><a href="#">Tra cứu hóa đơn</a></li>
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div className="footer-best-col">
            <h4>Về Techvicom</h4>
            <ul>
              <li><a href="#">Giới thiệu công ty</a></li>
              <li><a href="#">Tin tức & sự kiện</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Hệ thống cửa hàng</a></li>
              <li><a href="#">Đại lý ủy quyền</a></li>
              <li><a href="#">Dự án doanh nghiệp</a></li>
            </ul>
          </div>

          {/* Hỗ trợ & Chính sách */}
          <div className="footer-best-col">
            <h4>Hỗ trợ & Chính sách</h4>
            <ul>
              <li><a href="#">Tư vấn: <b>1800.6601 (1)</b></a></li>
              <li><a href="#">Kỹ thuật: <b>1800.6601 (2)</b></a></li>
              <li><a href="#">Góp ý: <b>1800.6616</b> (8h-22h)</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Sitemap</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & Back to Top */}
      <div className="footer-best-bottom">
        <div className="footer-best-bottom-inner">
          <span>&copy; 2024 Techvicom. All rights reserved.</span>
        </div>
      </div>
      <button
        className={`footer-best-backtotop${showBackToTop ? ' show' : ''}`}
        onClick={scrollToTop}
        aria-label="Quay lại đầu trang"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 19V5M12 5l-7 7m7-7l7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {/* Chat Box Floating Button */}
      <button
        className="footer-chatbox-btn"
        style={{position:'fixed',right:32,bottom:96,zIndex:101,background:'linear-gradient(135deg,#ff6c2f,#ffb86c)',color:'#fff',border:'none',borderRadius:'50%',width:54,height:54,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 16px rgba(255,108,47,0.18)',cursor:'pointer'}}
        onClick={()=>setShowChat(v=>!v)}
        aria-label="Chat hỗ trợ"
      >
        <FaComments style={{fontSize:28}} />
      </button>
      {showChat && (
        <div style={{position:'fixed',right:32,bottom:160,zIndex:102,width:340,maxWidth:'95vw',background:'#fff',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,0.18)',padding:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
          <div style={{background:'linear-gradient(90deg,#ffb86c,#ff6c2f)',color:'#fff',padding:'14px 18px',fontWeight:700,fontSize:18,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span>Hỗ trợ trực tuyến</span>
            <button onClick={()=>setShowChat(false)} style={{background:'none',border:'none',color:'#fff',fontSize:22,cursor:'pointer'}}>&times;</button>
          </div>
          <div style={{padding:18,minHeight:120,maxHeight:320,overflowY:'auto',fontSize:15,color:'#222'}}>Xin chào! Bạn cần hỗ trợ gì? (Demo chat box)</div>
          <div style={{padding:12,borderTop:'1px solid #eee',display:'flex',gap:8}}>
            <input type="text" placeholder="Nhập tin nhắn..." style={{flex:1,padding:'8px 12px',borderRadius:8,border:'1px solid #eee',fontSize:15}} />
            <button style={{background:'#ff6c2f',color:'#fff',border:'none',borderRadius:8,padding:'8px 18px',fontWeight:600,cursor:'pointer'}}>Gửi</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer; 