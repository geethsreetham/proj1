import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✨ Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setMessage('');
    } else {
      setError('');
      setMessage(`A reset link has been sent to ${email} 💌`);
      // Here, you’d typically call your backend/Firebase API
      // Example: axios.post('/api/forgot-password', { email })
    }
  };

  return (
    <div className="forgot-wrapper">
      <form className="forgot-box" onSubmit={handleSubmit}>
        <h2>Forgot Password?</h2>
        <p>Enter your email and we'll send reset instructions ✉️</p>

        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>

        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <div className="back-login">
          <Link to="/login">← Back to Login</Link>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;