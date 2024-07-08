import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../api';

const BookDetails = () => {
  const { id : book_id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookById(book_id)
      .then(res => {
        setBook(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [book_id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      <h2>Book Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <p className="card-text">Author: {book.Author.name}</p>
          <p className="card-text">Genre: {book.Genre.genre_name}</p>
          <p className="card-text">Price: ${book.price}</p>
          <p className="card-text">Publication Date: {new Date(book.publication_date).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;