import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import './LogoCard.css';

const LogoCard = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    console.log('Logo clicked, applying fade-out');
    document.body.classList.add('fade-out');
    setTimeout(() => {
      console.log('Navigating to /login');
      navigate('/login');
      document.body.classList.remove('fade-out');
      console.log('Fade-out class removed');
    }, 500);
  };

  return (
    <div className="logo-card-wrapper flex justify-center items-center min-h-screen w-screen relative z-10">
      <div className="logo-circle flex justify-center items-center" onClick={handleLogoClick}>
        <div className="logo-card-content text-center">
          <img src={logo} alt="Logo" className="logo-img clickable" />
          <p className="logo-text">Nove Link</p>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;