import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './BooksPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import EditBookForm from './EditBookForm'; // Import the EditBookForm component
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BooksPage() {
  // State variables
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Fetch books from API on component mount
  useEffect(() => {
    refreshBooks();
  }, []);

  // Function to fetch books
  const refreshBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Error fetching books. Please try again.');
      setLoading(false);
    }
  };

  // Handle delete book action
  const handleDelete = (id) => {
    setBookToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm book deletion
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

  // Handle edit book action
  const handleEdit = (book) => {
    setBookToEdit(book);  // Set the selected book ID
  };

  // Close edit book offcanvas
  const handleCloseEditOffcanvas = () => {
    setBookToEdit(null);
    refreshBooks();
  };

  // Determine books to display (search results or all books)
  const displayBooks = searchResults ? searchResults : books;

  return (
    <>
      <CustomNavbar />
      <div className="search-component-container">
        <SearchComponent setSearchResults={setSearchResults} refreshBooks={refreshBooks} />
      </div>
      <div className="container books-page-container">
        <h2 className="text-center mb-4">Books</h2>
        
        {/* Render loading message */}
        {loading && <p>Loading...</p>}

        {/* Render no books message */}
        {!loading && displayBooks.length === 0 && <p>No books found.</p>}

        {/* Render books */}
        {!loading && displayBooks.length > 0 && (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {displayBooks.map((book) => (
              <div key={book.book_id} className="col mb-3">
                <div className="card h-100">
                  <div className="row g-0">
                    <div className="col-md-4">
                      {/* Book image */}
                      <img 
                        src={book.imagePath ? book.imagePath : process.env.PUBLIC_URL + '/images/default_book_image.jpg'} 
                        className="img-fluid rounded-start book-card-img" 
                        alt={book.title} 
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column justify-content-between">
                        {/* Book details */}
                        <div>
                          <h5 className="card-title">{book.title}</h5>
                          <p className="card-text">Author: {book.Author.name}</p>
                          <p className="card-text">Genre: {book.Genre.genre_name}</p>
                          <p className="card-text">Price: ${book.price}</p>
                          <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
                        </div>
                        {/* Edit and delete icons */}
                        <div className="mt-auto d-flex justify-content-end">
                          <FaEdit className="text-secondary me-2 edit-icon" onClick={() => handleEdit(book)} />
                          <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(book.book_id)} />
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

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
      
      {/* Edit book offcanvas */}
      {bookToEdit && (
        <Offcanvas show={true} onHide={handleCloseEditOffcanvas} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit Book</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <EditBookForm book={bookToEdit} onClose={handleCloseEditOffcanvas} />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Floating action button to add new book */}
      <Link to="/add-book" className="fab">
        <FaPlus className="fab-icon" />
      </Link>
    </>
  );
}

export default BooksPage;
