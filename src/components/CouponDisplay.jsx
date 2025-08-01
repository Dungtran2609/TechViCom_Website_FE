import React from 'react';

const CouponDisplay = ({ coupons = [], loading = false }) => {
  if (loading) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Đang tải mã giảm giá...</div>;
  }
  if (!coupons.length) {
    return <div style={{ padding: 32, textAlign: 'center' }}>Không có mã giảm giá nào.</div>;
  }
  return (
    <div className="coupon-list">
      <h2 className="section-title">Mã giảm giá hot</h2>
      <div className="coupons-grid">
        {coupons.map((coupon) => (
          <div className="coupon-card" key={coupon.id}>
            <div className="coupon-code">{coupon.code}</div>
            <div className="coupon-desc">{coupon.description}</div>
            <div className="coupon-discount">
              Giảm {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `${coupon.discount_value.toLocaleString()}đ`}
            </div>
            {coupon.expiry_date && (
              <div className="coupon-expiry">HSD: {new Date(coupon.expiry_date).toLocaleDateString('vi-VN')}</div>
            )}
            <button className="coupon-copy-btn" onClick={() => navigator.clipboard.writeText(coupon.code)}>
              Sao chép mã
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponDisplay;
