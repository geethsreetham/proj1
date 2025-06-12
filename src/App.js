import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Splash from './components/Splash';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ReadBook from './components/ReadBook';
import Books from './components/Books'; // Add the new Books page
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/read-book/:id" element={<ReadBook />} />
        <Route path="/read-book/:id/chapter/:chapterIndex" element={<ReadBook />} />
        <Route path="/books" element={<Books />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;