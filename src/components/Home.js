import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Home.css';

function Home() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/books', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="home-container">
      <h2>Popular Books</h2>
      <Link to="/profile" className="profile-link">Go to Profile</Link>
      {error && <p className="error">{error}</p>}
      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.isbn} className="book-card">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>By: {book.author}</p>
              <Link to={`/read-book/${book.isbn}`} className="read-button">Read Now</Link>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  );
}

export default Home;