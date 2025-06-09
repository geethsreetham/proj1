import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import logo from '../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Stop event bubbling
    setLoading(true);
    setError('');
    console.log('Login attempt:', { email }); // Debug log
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login response:', response.data); // Debug log
      localStorage.setItem('token', response.data.token);
      console.log('Token set, navigating to /home'); // Debug log
      navigate('/home', { replace: true }); // Replace history to prevent back navigation
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Novelink Logo" className="login-logo" />
        <h2>Novelink Login</h2>
        {error && <p className="error">{error}</p>}
        {loading && <div className="loader"></div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/forgot-password" className="forgot-password">
          Forgot Password?
        </Link>
        <p>
          Don't have an account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;