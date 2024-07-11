import React, { useState, useEffect } from 'react';
import { getAuthors, deleteAuthor } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CustomNavbar from './Navbar';
import './AuthorsPage.css'; // Import custom CSS

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await getAuthors();
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Error fetching authors. Please try again.');
    }
  };

  const handleEdit = (id) => {
    navigate("/edit-author/" + id);
  }

  const handleDelete = async (authorId) => {
    try {
      await deleteAuthor(authorId);
      fetchAuthors();
      toast.success('Author deleted successfully!');
    }
    catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Error deleting author. Please try again.');
    }
  }

  return (
    <>
      <CustomNavbar />
      <div className="container my-3">
        <h2 className="text-center mb-4">Authors</h2>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {authors.map(author => (
            <div key={author.author_id} className="col">
              <div className="card h-100 author-card">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{author.name}</h5>
                  <p className="card-text flex-grow-1">Biography: {author.biography}</p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <FaEdit className="text-secondary me-md-2 edit-icon" onClick={() => handleEdit(author.author_id)} />
                    <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(author.author_id)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/add-author" className="btn btn-primary">Add New Author</Link>
        </div>
      </div>
    </>
  );
};

export default AuthorsPage;
