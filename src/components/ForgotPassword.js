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
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <img src={logo} alt="Novelink Logo" className="forgot-password-logo" />
        <h2>Reset Password</h2>
        {message && <p className="message">{message}</p>}
        {loading && <div className="loader"></div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p>
          Back to <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;