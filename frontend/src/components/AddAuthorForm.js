import React, { useState } from 'react';
import { addAuthor } from '../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAuthorForm = () => {
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAuthor({ name, biography });
      navigate("/authors");
      toast.success('Author added successfully!');
      setName('');
      setBiography('');
      
    } catch (error) {
      console.error('Error adding author:', error);
      toast.error('Error adding author. Please try again.');
      // Handle error state or display error message
    }
  };

  const handleCancel = () => {
    navigate('/authors'); // Redirect to /authors when cancel button is clicked
  };

  return (
    <>
    <div className="container my-3">
      <h2 style={{ textAlign: 'center'}}>Add New Author</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="biography" className="form-label">Biography</label>
          <textarea
            className="form-control"
            id="biography"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows="5"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Add Author</button>
        <button type="button" className="btn btn-secondary mx-2" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
    </>
  );
};

export default AddAuthorForm;
