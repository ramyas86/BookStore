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
    imagePath: ''
  });
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
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
          imagePath: fetchedBook.imagePath || ''
        });

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
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBook(prevBook => ({
        ...prevBook,
        imagePath: imageUrl 
      }));
    }
  };

  const handleFileUpload = async () => {                                                                                                       
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch(`/upload-image/${id}`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setBook(prevBook => ({
        ...prevBook,
        imagePath: data.path // Update the image path
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFile) {
      await handleFileUpload();
    }
    try {
      await updateBook(id, {
        title: book.title,
        author_id: book.authorId,
        genre_id: book.genreId,
        price: book.price,
        publication_date: book.publicationDate,
        imagePath: book.imagePath
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
            <label htmlFor="imagePath" className="form-label">Image Path</label>
            <input
              type="text"
              className="form-control"
              id="imagePath"
              name="imagePath"
              value={book.imagePath}
              onChange={handleChange}
              disabled // Disable editing of imagePath directly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="imageFile" className="form-label">Choose New Image File</label>
            <input
              type="file"
              className="form-control-file"
              id="imageFile"
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
