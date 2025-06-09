import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo
import '../styles/Splash.css';

const Splash = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/login');
  };

  return (
    <div className="splash-container" onClick={handleEnter}>
      <img src={logo} alt="Logo" className="logo" />
      <p className="enter-text">Click Anywhere to Enter</p>
    </div>
  );
};

export default Splash;