import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import logo from './assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    console.log('Forgot Password clicked, applying fade-out');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      console.log('Navigating to /forgot-password');
      navigate('/forgot-password');
      document.body.classList.remove('fade-out');
      console.log('Fade-out class removed');
    }, 500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login button clicked, applying fade-out');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      console.log('Navigating to /main');
      navigate('/main');
      document.body.classList.remove('fade-out');
      console.log('Fade-out class removed');
    }, 500);
  };

  return (
    <div className="login-wrapper flex justify-center items-center">
      <div className="login-glass">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="login-logo mb-3" />
          <h2 className="login-title">ようこそ, NoveLink ✨</h2>
          <p className="login-sub">Enter the portal to your destiny~</p>
        </div>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group mb-3">
            <input type="email" className="form-control login-input" placeholder="Email" />
          </div>
          <div className="form-group mb-4">
            <input type="password" className="form-control login-input" placeholder="Password" />
          </div>
          <button type="submit" className="btn login-btn w-100">Login</button>

          {/* Forgot password link with transition */}
          <div className="text-center mt-3">
            <Link
              to="/forgot-password"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPasswordClick();
              }}
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;