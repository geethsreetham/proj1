import React from 'react';

function Header() {
  return (
    <nav className="navbar bg-body-tertiary position-relative">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Left Section */}
        <div className="d-flex gap-2">
          <button className="btn" href="#">Home</button>
          <button className="btn" href="#">Genre</button>
          <button className="btn" href="#">Comics</button>
        </div>

        {/* Center Section (Absolutely Centered) */}
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center">
          <img src="./logo.png" alt="Logo" width="30" height="24" className="me-2" />
          <span className="navbar-brand mb-0 h1">novelink</span>
        </div>

        {/* Right Section */}
        <div className="d-flex align-items-center gap-2">
          <button className="btn login-btn">Login</button>
          <span className="cart-text pe-3">Cart</span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
