import React from 'react';
import { FaTimes, FaTrash } from 'react-icons/fa';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 31990000,
      quantity: 1,
      image: '/images/products/iphone-15-pro.png'
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 5G',
      price: 29990000,
      quantity: 1,
      image: '/images/products/samsung-s24.png'
    }
  ]);

  const handleQuantityChange = (id, delta) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Giỏ hàng của bạn</h3>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Giỏ hàng trống</p>
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="item-image" />
              <div className="item-details">
                <h4>{item.name}</h4>
                <div className="item-price">{(item.price * item.quantity).toLocaleString()}đ</div>
                <div className="item-controls">
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>
                  <button className="remove-button">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Tổng tiền:</span>
          <span className="total-amount">{total.toLocaleString()}đ</span>
        </div>
        <button className="checkout-button">Thanh toán</button>
      </div>
    </div>
  );
};

export default CartSidebar; 