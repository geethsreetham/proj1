import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './components/Splash';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ReadBook from './components/ReadBook';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/read-book/:isbn" element={<ReadBook />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;