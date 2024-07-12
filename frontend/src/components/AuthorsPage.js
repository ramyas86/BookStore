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
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
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

  const handleDelete = (authorId) => {
    setAuthorToDelete(authorId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAuthor(authorToDelete);
      fetchAuthors();
      toast.success('Author deleted successfully!');
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    } catch (error) {
      console.error('Error deleting author:', error);
      toast.error('Error deleting author. Please try again.');
      setShowDeleteModal(false);
      setAuthorToDelete(null);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="container my-1">
        <h2 className="text-center mb-2">Authors</h2>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-4">
          <Link to="/add-author" className="btn btn-primary">Add New Author</Link>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {authors.map(author => (
            <div key={author.author_id} className="col">
              <div className="card h-100 author-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    {author.imagePath ? (
                      <img 
                        src={author.imagePath} 
                        className="author-card-img rounded-circle" 
                        alt={author.name} 
                      />
                    ) : (
                      <div className="author-initial rounded-circle">
                        {author.name.charAt(0)}
                      </div>
                    )}
                    <div className="ms-3">
                      <h5 className="card-title mb-1">{author.name}</h5>
                    </div>
                  </div>
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
      </div>
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default AuthorsPage;

