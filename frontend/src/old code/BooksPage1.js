import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div style={{ maxWidth: '700px', margin: 'auto', marginTop: '50px' }}>
      <h2>Books</h2>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
        <Link to="/add-book">Add New Book</Link>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && books.length === 0 && <p>No books found.</p>}
      {!loading && books.length > 0 && (
        <ul className="list-group">
          {books.map((book) => (
            <li key={book.book_id} className="list-group-item d-flex justify-content-between align-items-center">
              <Link to={`/books/${book.book_id}`}>{book.title}</Link>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button className='btn btn-secondary me-md-2' onClick={() => handleEdit(book.book_id)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(book.book_id)}>Delete</button>
              </div>
            </li>
))}
        </ul>
      )}
    </div>
  );
};

export default BooksPage;
