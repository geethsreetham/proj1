import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Import the logo
import '../styles/Splash.css';

function Splash() {
  const navigate = useNavigate();
  const handleEnter = () => {
    navigate('/login'); // Change '/login' to your homepage route if needed
  };
  return (
    <div className="splash-container" onClick={handleEnter} style={{ cursor: 'pointer' }}>
      <img src={logo} alt="Logo" className="splash-logo" />
      <div className="splash-title">Welcome to Novelink</div>
      <div className="splash-desc">A world of stories awaits. Discover, read, and enjoy a premium reading experience.</div>
      <div className="splash-enter">Click Anywhere to Enter</div>
    </div>
  );
}

export default Splash;