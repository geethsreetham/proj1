import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../App.css';
import "../styles/ReadBook.css";

function ReadBook() {
  const { id, chapterIndex = 0 } = useParams();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState('');
  const [chapters, setChapters] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(parseInt(chapterIndex));
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/books/${id}/chapter/${currentIndex}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const bookResponse = await axios.get(`http://localhost:5000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBook(bookResponse.data);
        setChapter(response.data.chapter);
        setChapters(response.data.chapters);
        setCurrentIndex(response.data.currentIndex);
      } catch (err) {
        setError('Failed to load book or chapter.');
      }
    };
    fetchBook();
  }, [id, currentIndex]);

  const handleNextChapter = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!book) {
    return (
      <div className="page-container">
        <Header />
        <p className="loading-text">Loading book...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header />
      <div className="page-content">
        {error && <p className="error">{error}</p>}
        <h2>{book.title}</h2>
        <p>By: {(Array.isArray(book.author) ? book.author.join(', ') : book.author) || 'Unknown'}</p>
        {chapters.length > 0 && (
          <div className="chapter-navigation">
            <button onClick={handlePrevChapter} disabled={currentIndex === 0} className="btn">
              Previous Chapter
            </button>
            <span>Chapter {currentIndex + 1} of {chapters.length}</span>
            <button onClick={handleNextChapter} disabled={currentIndex === chapters.length - 1} className="btn">
              Next Chapter
            </button>
          </div>
        )}
        <div className="book-content">
          {chapter ? (
            <p>{chapter}</p>
          ) : (
            <p className="content-unavailable">No Content Available</p>
          )}
        </div>
        <Link to="/home" className="btn">Back to Home</Link>
      </div>
    </div>
  );
}

export default ReadBook;