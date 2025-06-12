import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../styles/Cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data);
      } catch (err) {
        setError('Failed to fetch cart.');
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/user/cart/remove', { book_id: bookId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cart.filter(item => item.book_id.id !== bookId));
    } catch (err) {
      setError('Failed to remove book from cart.');
    }
  };

  return (
    <div className="cart-container">
      <Header />
      <h2>Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.book_id.id} className="cart-item">
            <img src={item.book_id.cover} alt={item.book_id.title} className="cart-book-cover" />
            <div className="cart-book-info">
              <h3>{item.book_id.title}</h3>
              <p>By: {item.book_id.author.join(', ')}</p>
              <p>Price: ${item.book_id.price}</p>
              <button onClick={() => handleRemove(item.book_id.id)}>Remove</button>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;