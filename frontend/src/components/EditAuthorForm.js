import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, updateAuthor } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditAuthorForm.css'; // Import a custom CSS file for additional styling

const EditAuthorForm = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState({ name: '', biography: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await getAuthorById(id);
        const fetchedAuthor = response.data;

        setAuthor({
          name: fetchedAuthor.name,
          biography: fetchedAuthor.biography
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching author:', error);
        toast.error('Error fetching author data.');
      }
    };

    fetchAuthor();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor(prevAuthor => ({
      ...prevAuthor,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuthor(id, { name: author.name, biography: author.biography });
      navigate('/authors');
      toast.success('Author updated successfully!');
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Error updating author. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/authors');
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="container my-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4">Edit Author</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={author.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="biography" className="form-label">Biography:</label>
            <textarea
              className="form-control"
              id="biography"
              name="biography"
              value={author.biography}
              onChange={handleChange}
              rows="5"
              required
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

export default EditAuthorForm;
