import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import './LogoCard.css';

const LogoCard = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Smooth transition to login
    document.body.classList.add('fade-out');
    setTimeout(() => {
      navigate('/login');
      document.body.classList.remove('fade-out');
    }, 500);
  };

  return (
    <div className='logo-card-wrapper d-flex justify-content-center align-items-center'>
      <div className="logo-card-glass d-flex justify-content-center align-items-center">
        <div className="logo-card-content text-center">

  
    <div className="logo-wrapper">
      <div className="logo-glass" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" className="logo-img clickable" />
        <p className='logo-text'>Nove Link</p>
      </div>
    </div>
    </div>
      </div>
        </div>
  );
};

export default LogoCard;
