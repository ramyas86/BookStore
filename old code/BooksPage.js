import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './BooksPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
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

  const handleDelete = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(bookToDelete);
      setBooks(books.filter(book => book.book_id !== bookToDelete));
      toast.success('Book deleted successfully!');
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Error deleting book. Please try again.');
      setShowDeleteModal(false);
      setBookToDelete(null);
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
                                  src={book.imagePath ? book.imagePath : process.env.PUBLIC_URL + '/images/default_image.jpg'} 
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
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default BooksPage;
