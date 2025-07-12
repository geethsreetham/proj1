import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css';
import logo from '../assets/logo.png';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/login'), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        username,
        name,
        dob
      });
      setSuccess('Registration successful! Check your email for a welcome message. Redirecting to login...');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Logo" className="register-logo" />
      <div className="register-title">Novelink Register</div>
      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label" htmlFor="username">Username</label>
        <input
          className="register-input"
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          disabled={loading}
        />
        <label className="register-label" htmlFor="fullname">Full Name</label>
        <input
          className="register-input"
          type="text"
          id="fullname"
          name="fullname"
          placeholder="Full Name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
        />
        <label className="register-label" htmlFor="dob">Date of Birth</label>
        <input
          className="register-input"
          type="date"
          id="dob"
          name="dob"
          placeholder="dd-mm-yyyy"
          required
          value={dob}
          onChange={e => setDob(e.target.value)}
          disabled={loading}
        />
        <label className="register-label" htmlFor="email">Email</label>
        <input
          className="register-input"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />
        <label className="register-label" htmlFor="password">Password</label>
        <input
          className="register-input"
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />
        <button className="register-btn" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="error" style={{ color: 'red', marginTop: '1em', textAlign: 'center' }}>{error}</div>}
        {success && <div className="success" style={{ color: 'green', marginTop: '1em', textAlign: 'center' }}>{success}</div>}
      </form>
      <div className="register-links">
        <span>Already have an account? <a href="/login">Login</a></span>
      </div>
    </div>
  );
}

export default Register;