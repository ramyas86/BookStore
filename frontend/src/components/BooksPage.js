import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './BooksPage.css'; // Import the CSS file for styling

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
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
      <div className="container books-page-container">
        <div className="row">
          <div className="col-md-3">
            <div className="search-component-container">
              <SearchComponent setSearchResults={setSearchResults} />
            </div>
          </div>
          <div className="col-md-9">
            <h2 className="text-center mb-4">Books</h2>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
              <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
            </div>
            {loading && <p>Loading...</p>}
            {!loading && displayBooks.length === 0 && <p>No books found.</p>}
            {!loading && displayBooks.length > 0 && (
              <div className="row">
                {displayBooks.map((book) => (
                  <div key={book.book_id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="accordion" id={`booksAccordion${book.book_id}`}>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id={`heading${book.book_id}`}>
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${book.book_id}`}
                              aria-expanded="true"
                              aria-controls={`collapse${book.book_id}`}
                            >
                              {book.title}
                            </button>
                          </h2>
                          <div
                            id={`collapse${book.book_id}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading${book.book_id}`}
                            data-bs-parent={`#booksAccordion${book.book_id}`}
                          >
                            <div className="accordion-body">
                              <div className="card-body">
                                <img 
                                  src={book.imagePath ? process.env.PUBLIC_URL + `/images/${book.imagePath}` : process.env.PUBLIC_URL + '/images/default_image.jpg'} 
                                  className="card-img-top book-card-img" 
                                  alt={book.title} 
                                />
                                <h5 className="card-title">{book.title}</h5>
                                <p className="card-text">Author: {book.Author.name}</p>
                                <p className="card-text">Genre: {book.Genre.genre_name}</p>
                                <p className="card-text">Price: ${book.price}</p>
                                <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                  <FaEdit className="text-secondary edit-icon" onClick={() => handleEdit(book.book_id)} />
                                  <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(book.book_id)} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BooksPage;
