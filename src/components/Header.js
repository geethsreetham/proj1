import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Using logo.png
import '../styles/Header.css';

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query: searchQuery });
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchQuery('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/home">
          <img src={logo} alt="Novelink Logo" className="header-logo" />
        </Link>
        <h1>Novelink</h1>
      </div>
      <div className="header-right">
        <div className="search-container">
          <FaSearch onClick={toggleSearch} className="search-icon" />
          {showSearch && (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books..."
                className="search-input"
              />
            </form>
          )}
        </div>
        <Link to="/profile">
          <FaUser className="header-icon" />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="header-icon" />
        </Link>
        <FaSignOutAlt onClick={handleLogout} className="header-icon logout-icon" />
      </div>
    </header>
  );
}

export default Header;