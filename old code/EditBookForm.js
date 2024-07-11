import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthors, getBookById, getGenres, updateBook } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditBookForm = () => {
  const { id } = useParams();
  const [book, setBook] = useState({
    title: '',
    authorId: '',
    genreId: '',
    price: '',
    publicationDate: '',
    book_image: '', // This will store the image path
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        const fetchedBook = response.data;

        setBook({
          title: fetchedBook.title,
          authorId: fetchedBook.author_id,
          genreId: fetchedBook.genre_id,
          price: fetchedBook.price.toString(),
          publicationDate: fetchedBook.publication_date.slice(0, 10),
          book_image: fetchedBook.imagePath || '', // Assuming this is where the image path is stored
        });
        setImagePreview(fetchedBook.imagePath ? fetchedBook.imagePath : null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Error fetching book data.');
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await getAuthors();
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    const fetchGenres = async () => {
      try {
        const response = await getGenres();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Iterate over book object and append non-empty and non-null values to FormData
      Object.entries(book).forEach(([key, value]) => {
        if (value !== '' && value !== null) {
          formData.set(key, value);
        }
      });

      // formData.append('title', book.title);
      // formData.append('authorId', book.authorId);
      // formData.append('genreId', book.genreId);
      // formData.append('price', book.price);
      // formData.append('publicationDate', book.publicationDate);

      // Append imageFile if it exists
      if (imageFile) {
        formData.append('book_image', imageFile);
      }

      // Send PUT request to update book
      await updateBook(id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/books');
      toast.success('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Error updating book. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="container my-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Edit Book</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="authorId" className="form-label">Author</label>
            <select
              className="form-select"
              id="authorId"
              name="authorId"
              value={book.authorId}
              onChange={handleChange}
              required
            >
              {authors.map(author => (
                <option key={author.author_id} value={author.author_id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="genreId" className="form-label">Genre</label>
            <select
              className="form-select"
              id="genreId"
              name="genreId"
              value={book.genreId}
              onChange={handleChange}
              required
            >
              {genres.map(genre => (
                <option key={genre.genre_id} value={genre.genre_id}>
                  {genre.genre_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={book.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="publicationDate" className="form-label">Publication Date</label>
            <input
              type="date"
              className="form-control"
              id="publicationDate"
              name="publicationDate"
              value={book.publicationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
          {imagePreview && (
                <img src={imagePreview} alt="Book Preview" style={{ maxHeight: '100px' }} />
            )}
            <span className='mx-2'>Edit image </span>
            <input
              type="file"
              className="form-control-file"
              id="book_image"
              onChange={handleFileChange}
            />
            
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">Save Changes</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookForm;
