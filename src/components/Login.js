import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('Check your email for a password reset link');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Novelink Logo" className="login-logo" />
        <h2>Novelink Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
        <p>
          Don't have an account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;