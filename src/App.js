import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Splash from './components/Splash';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ReadBook from './components/ReadBook';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token, redirecting to /login'); // Debug log
    return <Navigate to="/login" />;
  }

  // Verify token asynchronously
  const verifyToken = async () => {
    try {
      await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Token verified, rendering component'); // Debug log
      return true;
    } catch (err) {
      console.error('Token verification failed:', err); // Debug log
      localStorage.removeItem('token');
      return false;
    }
  };

  // Since verifyToken is async, use a temporary state to handle navigation
  verifyToken().then((isValid) => {
    if (!isValid) {
      console.log('Invalid token, redirecting to /login'); // Debug log
      return <Navigate to="/login" />;
    }
  });

  return <Component />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<PrivateRoute component={Home} />} />
        <Route path="/read-book/:isbn" element={<PrivateRoute component={ReadBook} />} />
        <Route path="/profile" element={<PrivateRoute component={Profile} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;