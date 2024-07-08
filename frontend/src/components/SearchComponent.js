import React, { useState } from 'react';
import { searchBooksByTitle, searchBooksByAuthor, searchBooksByGenre } from '../api';
import './SearchComponent.css'; // Import CSS file for styling

const SearchComponent = ({ setSearchResults }) => {
  const [query, setQuery] = useState('');
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

      const results = {
        title: titleResults.data || [],
        author: authorResults.data || [],
        genre: genreResults.data || [],
      };

      setSearchResults(results);
    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('Error searching for books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="search-container">
      <h4>Search Books</h4>
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
    </div>
    </>
  );
};

export default SearchComponent;
