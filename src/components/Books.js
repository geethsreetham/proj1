import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import '../styles/Books.css';

function Books() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ query: '', genre: '', language: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setFilters((prev) => ({ ...prev, query }));

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/books/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...filters, query, page }
        });
        setBooks(response.data.books);
        setTotalPages(response.data.pages || 1);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch books.');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [location.search, filters, page]);

  const handleSearch = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const getAuthors = (author) => {
    if (Array.isArray(author)) {
      return author.join(', ');
    }
    return author || 'Unknown';
  };

  if (loading) {
    return (
      <div className="books-container">
        <Header onSearch={handleSearch} />
        <p className="loading-text">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="books-container">
      <Header onSearch={handleSearch} />
      {error && <p className="error">{error}</p>}
      <div className="books-content">
        <h2>Search Results</h2>
        <div className="filters">
          <h3>Filter Books</h3>
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Classics">Classics</option>
            <option value="Romance">Romance</option>
            <option value="Science">Science</option>
          </select>
          <select name="language" value={filters.language} onChange={handleFilterChange}>
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>
        <div className="books-list">
          <div className="books-grid">
            {books.length > 0 ? (
              books.map((book) => (
                <Link to={`/read-book/${book.id}`} key={book.id} className="book-card">
                  <img src={book.cover} alt={book.title} className="book-cover" />
                  <h3>{book.title}</h3>
                  <p>By: {getAuthors(book.author)}</p>
                  {book.full_text ? (
                    <p className="content-available">Content Available</p>
                  ) : (
                    <p className="content-unavailable">No Content Available</p>
                  )}
                </Link>
              ))
            ) : (
              <p>No books found. Try adjusting your search or filters.</p>
            )}
          </div>
          {page < totalPages && (
            <button onClick={loadMore} className="see-more-btn">See More</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Books;