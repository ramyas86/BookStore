import React, { useState, useEffect } from 'react';
import { getAuthors, deleteAuthor } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const response = await getAuthors();
    setAuthors(response.data);
  };

  const handleEdit = (id) => {
    navigate("/edit-author/"+id);
  }

  const handleDelete = async (authorId) => {
    try {
      await deleteAuthor(authorId);
      fetchAuthors();
      toast.success('Author deleted successfully!');
    }
    catch (error) {
      // Handle error
      console.error('Error deleting author:', error);
      toast.error('Error eleting author. Please try again.');
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', marginTop: '50px' }}>
      <h2>Authors</h2>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
      <Link to="/add-author">Add New Author</Link>
      </div>
      <ul className="list-group mt-4">
        {authors.map(author => (
          <li key={author.author_id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/authors/${author.author_id}`}>{author.name}</Link>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className='btn btn-secondary me-md-2' onClick={() => handleEdit(author.author_id)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDelete(author.author_id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorsPage;
