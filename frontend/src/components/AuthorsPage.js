import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, deleteAuthor } from '../api';
import { toast } from 'react-toastify';
import CustomNavbar from './Navbar';
import SearchComponent from '../components/SearchComponent';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './AuthorsPage.css'; // Import the CSS file for styling
import DeleteConfirmation from './DeleteConfirmation'; // Import the DeleteConfirmation component
import EditAuthorForm from './EditAuthorForm'; // Import the EditAuthorForm component
import { Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function AuthorsPage() {
  // State variables
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [authorToEdit, setAuthorToEdit] = useState(null);

  // Fetch authors from API on component mount
  useEffect(() => {
    refreshAuthors();
  }, []);

  // Function to fetch authors
  const refreshAuthors = async () => {
    setLoading(true);
    try {
      const response = await getAuthors();
      setAuthors(response.data.authors);
      console.log(response.data.authors)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Error fetching authors. Please try again.');
      setLoading(false);
    }
  };

  // Handle delete author action
  const handleDelete = (id) => {
    setAuthorToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm author deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteAuthor(authorToDelete);
      setAuthors(authors.filter(author => author.author_id !== authorToDelete));
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

  // Handle edit author action
  const handleEdit = (author) => {
    setAuthorToEdit(author);
  };

  // Close edit author offcanvas
  const handleCloseEditOffcanvas = () => {
    setAuthorToEdit(null);
    refreshAuthors();
  };

  // Determine authors to display (search results or all authors)
  const displayAuthors = searchResults ? searchResults : authors;

  return (
    <>
      <CustomNavbar />
      <div className="search-component-container">
        <SearchComponent setSearchResults={setSearchResults} refreshAuthors={refreshAuthors} />
      </div>
      <div className="container authors-page-container">
        <h2 className="text-center mb-4">Authors</h2>

        {/* Render loading message */}
        {loading && <p>Loading...</p>}

        {/* Render no authors message */}
        {!loading && displayAuthors.length === 0 && <p>No authors found.</p>}

        {/* Render authors */}
        {!loading && displayAuthors.length > 0 && (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {displayAuthors.map((author) => (
              <div key={author.author_id} className="col mb-3">
                <div className="card h-100">
                  <div className="row g-0">
                    <div className="col-md-4">
                      {/* Author image */}
                      {author.imagePath ? (
                        <img
                          src={author.imagePath ? author.imagePath : process.env.PUBLIC_URL + '/images/default_author_image.jpg'}
                          className="author-card-img rounded-circle"
                          alt={author.name} />
                      ) : (
                        <div className="author-initial rounded-circle">
                          {author.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="col-md-8">
                      <div className="card-body d-flex flex-column justify-content-between">
                        {/* Author details */}
                        <div>
                          <h5 className="card-title">{author.name}</h5>
                          <p className="card-text">Biography: {author.biography}</p>
                        </div>
                        {/* Edit and delete icons */}
                        <div className="mt-auto d-flex justify-content-end">
                          <FaEdit className="text-secondary me-2 edit-icon" onClick={() => handleEdit(author)} />
                          <FaTrash className="text-danger delete-icon" onClick={() => handleDelete(author.author_id)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleConfirm={handleConfirmDelete}
      />

      {/* Edit author offcanvas */}
      {authorToEdit && (
        <Offcanvas show={true} onHide={handleCloseEditOffcanvas} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Edit Author</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <EditAuthorForm author={authorToEdit} onClose={handleCloseEditOffcanvas} />
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Floating action button to add new author */}
      <Link to="/add-author" className="fab">
        <FaPlus className="fab-icon" />
      </Link>
    </>
  );
}

export default AuthorsPage;

