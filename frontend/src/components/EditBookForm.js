import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { getAuthors, getBookById, getGenres, updateBook } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBookForm = () => {
  const { id } = useParams();
  const [book, setBook] = useState({
    title: '',
    authorId: '',
    authorName: '',
    genreId: '',
    genreName: '',
    price: '',
    publicationDate: ''
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        const fetchedBook = response.data; // Assuming your API response gives you book data

        setBook({
          title: fetchedBook.title,
          authorId: fetchedBook.author_id,
          
          genreId: fetchedBook.genre_id,
    
          price: fetchedBook.price.toString(),
          publicationDate: fetchedBook.publication_date.slice(0, 10) // Assuming date format YYYY-MM-DD
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await getAuthors(); // Replace with your authors endpoint
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await getGenres(); // Replace with your genres endpoint
        setGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchBook();
    fetchAuthors();
    fetchGenres();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a PUT request to update the book with book.id
      await updateBook(id, { title: book.title, author_id: book.authorId, genre_id: book.genreId, price: book.price, publication_date: book.publicationDate});
      navigate("/books");
      toast.success('Book updated successfully!');
      console.log('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book. Please try again.');
    }
  };
  const handleCancel = () => {
    navigate("/books"); // Redirect to /books when cancel button is clicked
  };


  if (loading) return <p>Loading...</p>;

  return (
    <>
    <div className="container my-3">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
      <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={book.title} onChange={handleChange} />
        </div>

        <div className="mb-3">
        <label htmlFor="authorName" className="form-label">Author Name</label>
          <select className="form-select" name="authorId" value={book.authorId} onChange={handleChange}>
            {authors.map(author => (
              <option key={author.author_id} value={author.author_id}>{author.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="genreName" className="form-label">Genre Name</label>
          <select className="form-select" name="genreId" value={book.genreId} onChange={handleChange}>
            {genres.map(genre => (
              <option key={genre.genre_id} value={genre.genre_id}>{genre.genre_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input type="number" className="form-control" name="price" value={book.price} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="publicationDate" className="form-label">Publication Date</label>
          <input type="date" className="form-control" name="publicationDate" value={book.publicationDate} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Save Changes</button>
        <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
    </>
  );
};

export default EditBookForm;
