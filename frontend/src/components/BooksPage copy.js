import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    navigate("/edit-book/" + id);
  }

  return (
    <>
    <CustomNavbar />
    <div style={{ maxWidth: '700px', margin: 'auto', marginTop: '50px' }}>
      <h2>Books</h2>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
        <Link to="/add-book" className="btn btn-primary">Add New Book</Link>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && books.length === 0 && <p>No books found.</p>}
      {!loading && books.length > 0 && (
        <div className="accordion" id="booksAccordion">
          {books.map((book) => (
            <div key={book.book_id} className="accordion-item">
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
                data-bs-parent="#booksAccordion"
              >
                <div className="accordion-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">Author: {book.Author.name}</p>
                  <p className="card-text">Genre: {book.Genre.genre_name}</p>
                  <p className="card-text">Price: ${book.price}</p>
                  <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button className='btn btn-secondary me-md-2' onClick={() => handleEdit(book.book_id)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(book.book_id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default BooksPage;
