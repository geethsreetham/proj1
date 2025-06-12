import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../styles/Bookmarks.css';

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/bookmarks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarks(response.data);
      } catch (err) {
        setError('Failed to fetch bookmarks.');
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="bookmarks-container">
      <Header />
      <h2>Your Bookmarks</h2>
      {error && <p className="error">{error}</p>}
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <div key={bookmark.book_id.id} className="bookmark-item">
            <img src={bookmark.book_id.cover} alt={bookmark.book_id.title} className="bookmark-book-cover" />
            <div className="bookmark-book-info">
              <h3>{bookmark.book_id.title}</h3>
              <p>By: {bookmark.book_id.author.join(', ')}</p>
              <p>Last Chapter: {bookmark.last_chapter}</p>
              <Link to={`/read-book/${bookmark.book_id.id}`}>Resume Reading</Link>
            </div>
          </div>
        ))
      ) : (
        <p>No bookmarks available.</p>
      )}
    </div>
  );
}

export default Bookmarks;