import React, { useEffect, useState } from 'react';
import { addBook, addGenre, getAuthors, getGenres } from '../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddBookForm.css'; // Import the CSS file

const AddBookForm = () => {
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [genreId, setGenreId] = useState('');
  const [price, setPrice] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const navigate = useNavigate();
  const [newGenre, setNewGenre] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState('');

  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (newGenre.trim()) {
      try {
        await addGenre({ genre_name: newGenre });
        toast.success('Genre added successfully!')
        const genresData = await getGenres();
        setGenres(genresData.data);
      } catch (error) {
        console.error('Error adding genre', error);
        toast.error('Error adding genre. Please try again.');
      }
    }
  };

  useEffect(() => {
    const loadAuthorsAndGenres = async () => {
      try {
        const authorsData = await getAuthors();
        const genresData = await getGenres();
        setAuthors(authorsData.data);
        console.log(authorsData.data);
        setGenres(genresData.data);
      } catch (error) {
        console.error('Error fetching authors and genres:', error);
      }
    };

    loadAuthorsAndGenres();
  }, []);

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch('/upload/image', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      setImagePath(data.path); // Assuming the response returns the path
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
      await addBook({ title, author_id: authorId, genre_id: genreId, price, publication_date: publicationDate, imagePath });
      navigate("/books");
      toast.success('Book added successfully!');
      setTitle('');
      setAuthorId('');
      setGenreId('');
      setPrice('');
      setPublicationDate('');
      setImageFile(null);
      setImagePath('');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error('Error adding book. Please try again.');
      // Handle error state or display error message
    }
  };

  const handleCancel = () => {
    navigate('/books'); // Redirect to /authors when cancel button is clicked
  };

  return (
    <div className="container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="authorName" className="form-label">Author Name</label>
          <select
            className="form-select"
            id="author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.author_id} value={author.author_id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="genreName" className="form-label">Genre Name</label>
          <select
            className="form-select"
            id="genre"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            required
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.genre_id} value={genre.genre_id}>
                {genre.genre_name}
              </option>
            ))}
          </select>
          <input
            className="form-control my-3"
            type="text"
            placeholder="New genre"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleAddGenre}
          >
            Add Genre
          </button>
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="text"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="publicationDate" className="form-label">Publication Date</label>
          <input
            type="date"
            className="form-control"
            id="publicationDate"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="imagePath" className="form-label">Image Path</label>
          <input
            type="text"
            className="form-control"
            id="imagePath"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
          />
        </div>
        <div className="mb-3">
  <label htmlFor="imageFile" className="form-label">Choose Image File</label>
  <input
    type="file"
    className="form-control-file"
    id="imageFile"
    onChange={(e) => setImageFile(e.target.files[0])}
  />
</div>


        <button type="submit" className="btn btn-primary">Add Book</button>
        <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddBookForm;
