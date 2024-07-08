import React, { useState, useEffect } from 'react';
import { getAuthors, deleteAuthor } from '../api';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is imported
import CustomNavbar from './Navbar';

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
    <div style={{ maxWidth: '700px', margin: 'auto', marginTop: '50px' }}>
      <h2 style={{ textAlign: 'center'}}>Authors</h2>
      <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
        <Link to="/add-author" className="btn btn-primary">Add New Author</Link>
      </div>
      <div className="accordion" id="authorsAccordion">
        {authors.map(author => (
          <div key={author.author_id} className="accordion-item">
            <h2 className="accordion-header" id={`heading${author.author_id}`}>
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${author.author_id}`}
                aria-expanded="true"
                aria-controls={`collapse${author.author_id}`}
              >
                {author.name}
              </button>
            </h2>
            <div
              id={`collapse${author.author_id}`}
              className="accordion-collapse collapse"
              aria-labelledby={`heading${author.author_id}`}
              data-bs-parent="#authorsAccordion"
            >
              <div className="accordion-body">
                <h5 className="card-title">{author.name}</h5>
                <p className="card-text">Biography: {author.biography}</p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button className='btn btn-secondary me-md-2' onClick={() => handleEdit(author.author_id)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(author.author_id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default AuthorsPage;
