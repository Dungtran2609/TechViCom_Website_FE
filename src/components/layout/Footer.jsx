import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-content">
          <h2>Hệ thống Techvicom trên toàn quốc</h2>
          <p>Bao gồm Cửa hàng Techvicom</p>
          <button className="store-list-btn">Xem danh sách cửa hàng</button>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-content-wrapper">
          <div className="footer-section">
            <h3>KẾT NỐI VỚI Techvicom</h3>
            <div className="social-links">
              <a href="#" className="social-icon facebook">Facebook</a>
              <a href="#" className="social-icon messenger">Messenger</a>
              <a href="#" className="social-icon youtube">Youtube</a>
              <a href="#" className="social-icon tiktok">Tiktok</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>TỔNG ĐÀI MIỄN PHÍ</h3>
            <div className="hotline-info">
              <p>Tư vấn mua hàng (Miễn phí)</p>
              <p className="phone">1800.6601 (Nhánh 1)</p>
              <p>Hỗ trợ kỹ thuật</p>
              <p className="phone">1800.6601 (Nhánh 2)</p>
              <p>Góp ý, khiếu nại</p>
              <p className="phone">1800.6616 (8h00 - 22h00)</p>
            </div>
          </div>

          <div className="footer-section">
            <h3>VỀ CHÚNG TÔI</h3>
            <ul>
              <li><a href="#">Giới thiệu về công ty</a></li>
              <li><a href="#">Quy chế hoạt động</a></li>
              <li><a href="#">Dự án Doanh nghiệp</a></li>
              <li><a href="#">Tin tức khuyến mại</a></li>
              <li><a href="#">Giới thiệu máy đổi trả</a></li>
              <li><a href="#">Hướng dẫn mua hàng & thanh toán online</a></li>
              <li><a href="#">Đại lý ủy quyền và TTBH ủy quyền của Apple</a></li>
              <li><a href="#">Tra cứu hoá đơn điện tử</a></li>
              <li><a href="#">Tra cứu bảo hành</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>CHÍNH SÁCH</h3>
            <ul>
              <li><a href="#">Chính sách bảo hành</a></li>
              <li><a href="#">Chính sách đổi trả</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Chính sách trả góp</a></li>
              <li><a href="#">Chính sách khui hộp sản phẩm</a></li>
              <li><a href="#">Chính sách giao hàng & lắp đặt</a></li>
              <li><a href="#">Chính sách mạng gi đồng FPT</a></li>
              <li><a href="#">Chính sách thu thập & xử lý dữ liệu cá nhân</a></li>
              <li><a href="#">Quy định về hỗ trợ kỹ thuật & sao lưu dữ liệu</a></li>
              <li><a href="#">Chính sách giao hàng & lắp đặt: Điện máy, Gia dụng</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>HỖ TRỢ THANH TOÁN</h3>
            <div className="payment-methods">
              {/* Payment method icons will be added via CSS */}
            </div>
            
            <h3>CHỨNG NHẬN</h3>
            <div className="certificates">
              {/* Certificate icons will be added via CSS */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 