import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, updateAuthor } from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditAuthorForm = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState({
    name: '',
    biography: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await getAuthorById(id);
        const fetchedAuthor = response.data; // Assuming your API response gives you author data

        setAuthor({
          name: fetchedAuthor.name,
          biography: fetchedAuthor.biography
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching author:', error);
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
      // Make a PUT request to update the author with author.id
      await updateAuthor(id, {name: author.name, biography: author.biography});
      console.log('Author updated successfully!');
      navigate('/authors'); // Redirect to /authors after successful update
      toast.success('Author updated successfully!');
    } catch (error) {
      console.error('Error updating author:', error);
      toast.error('Error updating author. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/authors'); // Redirect to /authors when cancel button is clicked
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <div className="container my-3">
      <h2>Edit Author</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
      <label htmlFor="title" className="form-label">Name:</label>
          <input type="text" className="form-control" name="name" value={author.name} onChange={handleChange} />
        </div>

        <div className="mb-3">
        <label htmlFor="price" className="form-label">Biography:</label>
          <textarea className="form-control" name="biography" value={author.biography} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary mr-2">Save Changes</button>
        <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
    </>
  );
};

export default EditAuthorForm;
