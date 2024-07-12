import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './BooksPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import EditBookForm from './EditBookForm'; // Import the EditBookForm component
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);

  const refreshBooks = async () => {
    setLoading(true);
    try {
      const response = await getBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBooks();
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

  const handleEdit = (book) => {
    setBookToEdit(book);
  };

  const handleCloseEditOffcanvas = () => {
    setBookToEdit(null);
    refreshBooks();
  };

  const displayBooks = searchResults ? searchResults : books;

  return (
    <>
      <CustomNavbar />
      <div className="search-component-container">
        <SearchComponent setSearchResults={setSearchResults} refreshBooks={refreshBooks} />
      </div>
      <div className="container books-page-container">
        <h2 className="text-center mb-4">Books</h2>
        
        {/* Add New Book Button */}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
          <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
        </div>
  
        {loading && <p>Loading...</p>}
        {!loading && displayBooks.length === 0 && <p>No books found.</p>}
        {!loading && displayBooks.length > 0 && (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {displayBooks.map((book) => (
              <div key={book.book_id} className="col mb-3">
                <div className="card h-100">
                  <img 
                    src={book.imagePath ? book.imagePath : process.env.PUBLIC_URL + '/images/default_book_image.jpg'} 
                    className="card-img-top book-card-img" 
                    alt={book.title} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">Author: {book.Author.name}</p>
                    <p className="card-text">Genre: {book.Genre.genre_name}</p>
                    <p className="card-text">Price: ${book.price}</p>
                    <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <FaEdit className="text-secondary edit-icon" onClick={() => handleEdit(book)} />
                      <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(book.book_id)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
      
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
    </>
  );
}

export default BooksPage;
