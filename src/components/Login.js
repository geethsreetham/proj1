import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="login-title">Novelink Login</div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label" htmlFor="email">Email</label>
        <input
          className="login-input"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <label className="login-label" htmlFor="password">Password</label>
        <input
          className="login-input"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="error" style={{ color: 'red', marginTop: '1em', textAlign: 'center' }}>{error}</div>}
      </form>
      <div className="login-links">
        <a href="/forgot-password">Forgot Password?</a>
        <span>Don't have an account? <a href="/register">Register</a></span>
      </div>
    </div>
  );
}

export default Login;