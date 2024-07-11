import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import './BooksPage.css'; // Import the CSS file for styling

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null); // Add state for search results
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await getBooks();
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.book_id !== id));
      toast.success('Book deleted successfully!');
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate('/edit-book/' + id);
  };

  const displayBooks = searchResults ? searchResults : books;

  return (
    <>
      <CustomNavbar />
      <div className="books-page-container">
        <div className="search-component-container">
          <SearchComponent setSearchResults={setSearchResults} /> {/* Add SearchComponent */}
        </div>
        <div className="books-container">
          <h2 style={{ textAlign: 'center' }}>Books</h2>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
            <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
          </div>
          {loading && <p>Loading...</p>}
          {!loading && displayBooks.length === 0 && <p>No books found.</p>}
          {!loading && displayBooks.length > 0 && (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {displayBooks.map((book) => (
                <div key={book.book_id} className="col">
                  <div className="card h-100">
                    <img 
                      src={book.imagePath ? process.env.PUBLIC_URL + `/images/${book.imagePath}` : process.env.PUBLIC_URL + '/images/default_image.jpg'} 
                      className="card-img-top" 
                      alt={book.title} 
                    />
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text">Author: {book.Author.name}</p>
                      <p className="card-text">Genre: {book.Genre.genre_name}</p>
                      <p className="card-text">Price: ${book.price}</p>
                      <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button className="btn btn-secondary me-md-2" onClick={() => handleEdit(book.book_id)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(book.book_id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BooksPage;
