import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate for redirect
import axios from 'axios';
import Header from './Header';
import '../styles/Home.css';

function Home() {
  const [carouselBooks, setCarouselBooks] = useState([]);
  const [popular, setPopular] = useState({ today: [], week: [], month: [], all: [] });
  const [rightPopular, setRightPopular] = useState([]);
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ query: '', genre: '', language: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For redirecting to Books page

  useEffect(() => {
    const fetchCarouselBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/books/random', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCarouselBooks(response.data);
      } catch (err) {
        setError('Failed to fetch carousel books.');
      }
    };

    const fetchPopularBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/books/popular', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPopular(response.data);
        setRightPopular(response.data.all.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch popular books.');
      }
    };

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = { ...filters, page };
        const response = await axios.get('http://localhost:5000/api/books/search', {
          headers: { Authorization: `Bearer ${token}` },
          params
        });
        setBooks(response.data.books);
        setTotalPages(response.data.pages || 1); // Ensure totalPages is at least 1
      } catch (err) {
        setError('Failed to fetch books.');
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchCarouselBooks(), fetchPopularBooks(), fetchBooks()]);
      setLoading(false);
    };

    fetchAllData();
  }, [filters, page]);

  const handleSearch = (newFilters) => {
    // Redirect to Books page with search query
    navigate(`/books?query=${encodeURIComponent(newFilters.query)}`);
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
      <div className="home-container">
        <Header onSearch={handleSearch} />
        <p className="loading-text">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Header onSearch={handleSearch} />
      {error && <p className="error">{error}</p>}
      <div className="main-layout">
        <div className="main-content">
          <div className="carousel">
            <h2>Featured Books</h2>
            <div className="carousel-items">
              {carouselBooks.length > 0 ? (
                carouselBooks.map((book) => (
                  <Link to={`/read-book/${book.id}`} key={book.id} className="carousel-item">
                    <img src={book.cover} alt={book.title} className="carousel-img" />
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
                <p>No featured books available.</p>
              )}
            </div>
          </div>
          <div className="popular-section">
            <h2>Popular Books</h2>
            <div className="popular-today">
              <h3>Popular Today</h3>
              <div className="books-grid">
                {popular.today.map((book) => (
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
                ))}
              </div>
            </div>
            <div className="popular-week">
              <h3>Popular This Week</h3>
              <div className="books-grid">
                {popular.week.map((book) => (
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
                ))}
              </div>
            </div>
            <div className="popular-month">
              <h3>Popular This Month</h3>
              <div className="books-grid">
                {popular.month.map((book) => (
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
                ))}
              </div>
            </div>
            <div className="popular-all">
              <h3>All Popular</h3>
              <div className="books-grid">
                {popular.all.map((book) => (
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
                ))}
              </div>
            </div>
          </div>
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
            <h2>All Books</h2>
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
                <p>No books available. Try adjusting filters.</p>
              )}
            </div>
            {page < totalPages && (
              <button onClick={loadMore} className="see-more-btn">See More</button>
            )}
          </div>
        </div>
        <div className="right-sidebar">
          <h2>Popular</h2>
          <div className="right-popular-books">
            {rightPopular.length > 0 ? (
              rightPopular.map((book) => (
                <Link to={`/read-book/${book.id}`} key={book.id} className="right-book-card">
                  <img src={book.cover} alt={book.title} className="right-book-cover" />
                  <div className="right-book-info">
                    <h4>{book.title}</h4>
                    <p>By: {getAuthors(book.author)}</p>
                    {book.full_text ? (
                      <p className="content-available">Content Available</p>
                    ) : (
                      <p className="content-unavailable">No Content Available</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p>No popular books available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;