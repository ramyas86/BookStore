import React, { useState } from 'react';
import { searchBooksByTitle, searchBooksByAuthor, searchBooksByGenre } from '../api';
import './SearchPage.css'; // Import CSS file for styling

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [booksByTitle, setBooksByTitle] = useState([]);
  const [booksByAuthor, setBooksByAuthor] = useState([]);
  const [booksByGenre, setBooksByGenre] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const [titleResults, authorResults, genreResults] = await Promise.all([
        searchBooksByTitle(query),
        searchBooksByAuthor(query),
        searchBooksByGenre(query),
      ]);
      console.log('Title Results:', titleResults);
      console.log('Author Results:', authorResults);
      console.log('Genre Results:', genreResults);

      setBooksByTitle(titleResults.data || []); // Ensure data is always an array
      setBooksByAuthor(authorResults.data || []); // Ensure data is always an array
      setBooksByGenre(genreResults.data || []); // Ensure data is always an array
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Error searching for books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h1>Search Books</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by book title, author, or genre"
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="result-container">
        <div>
          <h2 className="result-category">Books by Title</h2>
          <ul className="result-list">
            {booksByTitle.map((book) => (
              <li key={book.id} className="result-item">
                <strong>{book.title}</strong> by {book.Author.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="result-category">Books by Author</h2>
          <ul className="result-list">
            {booksByAuthor.map((book) => (
              <li key={book.id} className="result-item">
                <strong>{book.title}</strong> by {book.Author.name}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="result-category">Books by Genre</h2>
          <ul className="result-list">
            {booksByGenre.map((book) => (
              <li key={book.id} className="result-item">
                <strong>{book.title}</strong> by {book.Author.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
