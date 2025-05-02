import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoCard from './LogoCard';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
import MainPage from './components/MainPage';
import Lightning from './Lightning';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-screen">
        {/* Lightning effect as background for all routes */}
        <Lightning
          hue={230}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
          className="absolute top-0 left-0 w-full h-full z-0"
        />
        
        {/* Routes */}
        <Routes>
          {/* Initial logo page (homepage) */}
          <Route
            path="/"
            element={
              <div className="relative z-10">
                <LogoCard />
              </div>
            }
          />
          
          {/* Login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Forgot password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main page after login */}
          <Route path="/main" element={<MainPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;