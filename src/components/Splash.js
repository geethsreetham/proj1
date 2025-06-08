import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Splash.css';
import logo from '../assets/logo.png';

function Splash() {
  return (
    <div className="splash-container">
      <img src={logo} alt="Novelink Logo" className="splash-logo" />
      <h1>Novelink</h1>
      <div className="splash-buttons">
        <Link to="/login" className="splash-button">Login</Link>
        <Link to="/register" className="splash-button">Register</Link>
      </div>
    </div>
  );
}

export default Splash;