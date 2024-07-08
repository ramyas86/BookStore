import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuthorById } from '../api';

const AuthorDetails = () => {
  const { id: author_id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthorById(author_id)
      .then(res => {
        setAuthor(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [author_id]);

  if (loading) return <p>Loading...</p>;
  if (!author) return <p>Book not found.</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', marginTop: '20px' }}>
      <h2>Author Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{author.name}</h5>
          <p className="card-text">Biography: {author.biography}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;