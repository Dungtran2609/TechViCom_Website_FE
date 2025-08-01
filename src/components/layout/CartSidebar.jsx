import React, { useEffect, useState } from 'react';
import { FaTimes, FaTrash, FaShoppingCart, FaChevronRight, FaSignInAlt } from 'react-icons/fa'; // Thêm icon FaSignInAlt
import './CartSidebar.css';
import { productAPI, userAPI } from '../../api';
import { Link, useNavigate } from 'react-router-dom';


const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  // Lắng nghe sự kiện đăng nhập/đăng xuất để cập nhật lại currentUser
  useEffect(() => {
    const updateUserStatus = () => {
      setCurrentUser(getCurrentUser());
    };
    window.addEventListener('userChanged', updateUserStatus);
    // Thêm listener cho sự kiện storage để cập nhật giỏ hàng khi có sản phẩm mới
    window.addEventListener('storage', updateUserStatus);
    return () => {
      window.removeEventListener('userChanged', updateUserStatus);
      window.removeEventListener('storage', updateUserStatus);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      productAPI.getProducts()
        .then(data => {
          // Đảm bảo luôn là mảng
          const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
          setProducts(arr);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || products.length === 0 || !currentUser) {
      // Nếu chưa đăng nhập, set giỏ hàng là mảng rỗng
      setCartItems([]);
      return;
    }
    
    // Nếu đã đăng nhập, lấy giỏ hàng của user
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
    }).filter(item => item.name !== 'Sản phẩm không tồn tại');

    setCartItems(mapped);
  }, [isOpen, products, currentUser]);


  const updateCart = async (newCart) => {
    if (!currentUser) return; // Chỉ cho phép cập nhật nếu đã đăng nhập
    try {
      const updatedUser = await userAPI.updateUser(currentUser.id, { cart: newCart });
      // Đảm bảo luôn lưu cart vào localStorage, kể cả khi API không trả về cart
      const userToSave = { ...updatedUser, cart: newCart };
      localStorage.setItem('user', JSON.stringify(userToSave));
      setCurrentUser(userToSave); // Cập nhật state currentUser để re-render
    } catch (error) {
      console.error("Lỗi cập nhật giỏ hàng của người dùng:", error);
    }
  };

  const updateQuantity = (id, storage, delta) => {
    const newCart = cartItems.map(item => {
      if (item.id === id && item.storage === storage) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (id, storage) => {
    const newCart = cartItems.filter(item => !(item.id === id && item.storage === storage));
    updateCart(newCart);
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
          <button className="close-button-modern" onClick={onClose} aria-label="Đóng giỏ hàng">
            <FaTimes />
          </button>
        </div>

        {/* ========================================================== */}
        {/* SỬA LỖI Ở ĐÂY: Hiển thị thông báo nếu chưa đăng nhập */}
        {/* ========================================================== */}
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
                        <button className="remove-button-modern" onClick={() => removeItem(item.id, item.storage)} aria-label="Xóa sản phẩm">
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
              <button className="checkout-button-modern" disabled={cartItems.length === 0} onClick={() => { onClose(); navigate('/checkout'); }}>
                <span>Thanh toán</span>
                <FaChevronRight style={{marginLeft: 8, fontSize: 16}} />
              </button>
              <Link
                to="/cart"
                className="view-cart-modern"
                onClick={onClose}
              >
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