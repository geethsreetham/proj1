import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ReadBook.css';

function ReadBook() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const getBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/books/${isbn}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBook(response.data);
      } catch (err) {
        setError('Book not found');
      }
    };
    getBook();
  }, [isbn]);

  return (
    <div className="read-book-container">
      {error && <p className="error">{error}</p>}
      {book ? (
        <div className="book-content-wrapper">
          <h2>{book.title}</h2>
          <p>By: {book.author}</p>
          <div className="book-content">
            {book.content || `Preview: ${book.description || 'No content available'}`}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ReadBook;