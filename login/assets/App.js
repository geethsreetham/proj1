import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogoCard from './logocard';
import LoginPage from './LoginPage';
import ForgotPassword from './ForgotPassword';
function App() {
  return (
    <Router>
      <Routes>
        {/* Initial logo page (homepage) */}
        <Route path="/" element={<LogoCard />} />

        {/*Login page */}
        <Route path="/login" element={<LoginPage />} />
       
        <Route path="/forgot-Password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}




export default App;
