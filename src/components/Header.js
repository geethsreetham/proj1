import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      navigate('/login');
      document.body.classList.remove('fade-out');
    }, 500);
  };

  return (
    <nav className="navbar header-glass position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Section */}
        <div className="d-flex gap-2">
          <button className="btn header-nav-link" href="#">Home</button>
          <button className="btn header-nav-link" href="#">Genre</button>
          <button className="btn header-nav-link" href="#">Comics</button>
        </div>

        {/* Center Section (Absolutely Centered) */}
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center">
          <img src={logo} alt="Logo" className="header-logo me-2" />
          <span className="navbar-brand mb-0 h1 header-brand">NoveLink</span>
        </div>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-2">
            <span className="cart-text pe-3 header-nav-link">Cart</span><br/>
            <button className="btn header-logout-btn" onClick={handleLogoutClick}>Logout</button>
          
        </div>
      </div>
    </nav>
  );
}

export default Header;