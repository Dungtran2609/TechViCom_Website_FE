import React, { useEffect, useState } from 'react';
import {
  FaTimes, FaTrash, FaShoppingCart, FaChevronRight, FaSignInAlt
} from 'react-icons/fa';
import './CartSidebar.css';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Hàm an toàn để đọc user từ localStorage
const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      return JSON.parse(userStr);
    }
  } catch (err) {
    console.error("Lỗi khi parse user:", err);
    localStorage.removeItem('user');
  }
  return null;
};

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  // Theo dõi thay đổi user
  useEffect(() => {
    const updateUserStatus = () => setCurrentUser(getCurrentUser());
    window.addEventListener('userChanged', updateUserStatus);
    window.addEventListener('storage', updateUserStatus);
    return () => {
      window.removeEventListener('userChanged', updateUserStatus);
      window.removeEventListener('storage', updateUserStatus);
    };
  }, []);

  // Fetch sản phẩm khi mở giỏ hàng
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Lỗi khi fetch sản phẩm:", err));
    }
  }, [isOpen]);

  // Xử lý mapping giỏ hàng từ user
  useEffect(() => {
    if (!isOpen || !products.length || !currentUser) {
      setCartItems([]);
      return;
    }

    const cart = currentUser.cart || [];

    const mapped = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const variant = product?.variants?.find(v => v.storage === item.variant?.storage);
      return {
        ...item,
        name: product?.name || 'Sản phẩm không tồn tại',
        image: product?.image || '',
        price: variant?.price || product?.price || 0,
        storage: variant?.storage || item.variant?.storage || '',
      };
    }).filter(i => i.name !== 'Sản phẩm không tồn tại');

    setCartItems(mapped);
  }, [isOpen, products, currentUser]);

  const updateCart = async (newCart) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`http://localhost:3001/users/${currentUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: newCart }),
      });
      const updatedUser = await res.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
    } catch (err) {
      console.error("Lỗi khi cập nhật giỏ hàng:", err);
    }
  };

  const updateQuantity = (id, storage, delta) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.storage === storage) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    updateCart(updated);
  };

  const removeItem = (id, storage) => {
    const updated = cartItems.filter(item => !(item.id === id && item.storage === storage));
    updateCart(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      <div className={`cart-overlay-modern${isOpen ? ' open' : ''}`} onClick={onClose} />
      <div className={`cart-sidebar-modern${isOpen ? ' open' : ''}`}>
        <div className="cart-header-modern">
          <div className="cart-header-left">
            <FaShoppingCart className="cart-header-icon" />
            <h3>Giỏ hàng của bạn</h3>
          </div>
          <button className="close-button-modern" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Nếu chưa đăng nhập */}
        {!currentUser ? (
          <div className="login-prompt-sidebar">
            <FaSignInAlt className="login-prompt-icon" />
            <p>Vui lòng đăng nhập để xem giỏ hàng</p>
            <button onClick={() => { onClose(); navigate('/login'); }}>
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-modern">
              {cartItems.length === 0 ? (
                <div className="empty-cart-modern">
                  <p>Giỏ hàng trống</p>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={`${item.id}-${item.storage}`} className="cart-item-modern">
                    <div className="item-image-modern-wrap">
                      <img src={item.image} alt={item.name} className="item-image-modern" />
                    </div>
                    <div className="item-details-modern">
                      <h4>{item.name}</h4>
                      <div className="item-price-modern">{item.price.toLocaleString()}đ</div>
                      <div className="item-variant-modern">{item.storage}</div>
                      <div className="item-controls-modern">
                        <div className="quantity-controls-modern">
                          <button onClick={() => updateQuantity(item.id, item.storage, -1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.storage, 1)}>+</button>
                        </div>
                        <button className="remove-button-modern" onClick={() => removeItem(item.id, item.storage)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer-modern">
              <div className="cart-total-modern">
                <span>Tổng tiền:</span>
                <span className="total-amount-modern">{total.toLocaleString()}đ</span>
              </div>
              <button
                className="checkout-button-modern"
                disabled={cartItems.length === 0}
                onClick={() => { onClose(); navigate('/checkout'); }}
              >
                <span>Thanh toán</span>
                <FaChevronRight style={{ marginLeft: 8, fontSize: 16 }} />
              </button>
              <Link to="/cart" className="view-cart-modern" onClick={onClose}>
                Xem tất cả sản phẩm trong giỏ hàng
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
