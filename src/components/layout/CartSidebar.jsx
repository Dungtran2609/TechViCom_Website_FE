import React, { useEffect, useState } from 'react';
import { FaTimes, FaTrash, FaShoppingCart, FaChevronRight } from 'react-icons/fa';
import './CartSidebar.css';
import { Link, useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products from API when sidebar opens
    if (isOpen) {
      fetch('http://localhost:3001/products')
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Map cart items to full product info
    const mapped = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const variant = product && product.variants ? product.variants.find(v => v.storage === item.variant?.storage) : null;
      return {
        ...item,
        name: product ? product.name : '',
        image: product ? product.image : '',
        price: variant ? variant.price : (product ? product.price : 0),
        storage: variant ? variant.storage : (item.variant ? item.variant.storage : ''),
      };
    });
    setCartItems(mapped);
  }, [isOpen, products]);

  const updateQuantity = (id, storage, delta) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex(item => item.id === id && item.variant?.storage === storage);
    if (idx > -1) {
      cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
      localStorage.setItem('cart', JSON.stringify(cart));
      // Cập nhật lại state
      const mapped = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        const variant = product && product.variants ? product.variants.find(v => v.storage === item.variant?.storage) : null;
        return {
          ...item,
          name: product ? product.name : '',
          image: product ? product.image : '',
          price: variant ? variant.price : (product ? product.price : 0),
          storage: variant ? variant.storage : (item.variant ? item.variant.storage : ''),
        };
      });
      setCartItems(mapped);
    }
  };

  const removeItem = (id, storage) => {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart = cart.filter(item => !(item.id === id && item.variant?.storage === storage));
    localStorage.setItem('cart', JSON.stringify(cart));
    // Cập nhật lại state
    const mapped = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      const variant = product && product.variants ? product.variants.find(v => v.storage === item.variant?.storage) : null;
      return {
        ...item,
        name: product ? product.name : '',
        image: product ? product.image : '',
        price: variant ? variant.price : (product ? product.price : 0),
        storage: variant ? variant.storage : (item.variant ? item.variant.storage : ''),
      };
    });
    setCartItems(mapped);
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

        <div className="cart-items-modern">
          {cartItems.length === 0 ? (
            <div className="empty-cart-modern">
              <p>Giỏ hàng trống</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id + '-' + item.storage} className="cart-item-modern">
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
          <button className="checkout-button-modern" onClick={() => { onClose(); navigate('/checkout'); }}>
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
      </div>
    </>
  );
};

export default CartSidebar; 