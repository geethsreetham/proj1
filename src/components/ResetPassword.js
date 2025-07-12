import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';
import logo from '../assets/logo.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => window.location.href = '/login', 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <img src={logo} alt="Logo" className="reset-logo" />
      <div className="reset-title">Reset Password</div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {loading && <div className="loader"></div>}
      <form className="reset-form" onSubmit={handleSubmit}>
        <label className="reset-label" htmlFor="password">New Password</label>
        <input className="reset-input" type="password" id="password" name="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        <button className="reset-btn" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
      <div className="reset-links">
        <a href="/login">Back to Login</a>
      </div>
    </div>
  );
}

export default ResetPassword;