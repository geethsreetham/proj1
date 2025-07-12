import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotPassword.css';
import logo from '../assets/logo.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('If the email exists, a reset link has been sent to your inbox.');
    } catch (err) {
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <img src={logo} alt="Logo" className="forgot-logo" />
      <div className="forgot-title">Forgot Password</div>
      <form className="forgot-form">
        <label className="forgot-label" htmlFor="email">Email</label>
        <input className="forgot-input" type="email" id="email" name="email" placeholder="Email" required />
        <button className="forgot-btn" type="submit">Send Reset Link</button>
      </form>
      <div className="forgot-links">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
}

export default ForgotPassword;