import React from 'react';
import './LoginPage.css';
import logo from './assets/logo.png';

const LoginPage = () => {
  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="login-glass">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="login-logo mb-3" />
          <h2 className="login-title">ようこそ, NoveLink ✨</h2>
          <p className="login-sub">Enter the portal to your destiny~</p>
        </div>

        <form>
          <div className="form-group mb-3">
            <input type="email" className="form-control login-input" placeholder="Email" />
          </div>
          <div className="form-group mb-4">
            <input type="password" className="form-control login-input" placeholder="Password" />
          </div>
          <button type="submit" className="btn login-btn w-100">Login</button>

          {/* 💫 The new “Forgot password?” link */}
          <div className="text-center mt-3">
            <a href="/Forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
