// Example usage of Bootstrap Dropdown in Navbar

import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const Navbar = () => {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light" style={{backgroundColor: "#e3f2fd"}}>
      <div className="container">
        <Link to="/" className="navbar-brand">Bookstore</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/authors" className="nav-link">Authors</Link>
            </li>
            <li className="nav-item">
              <Link to="/books" className="nav-link">Books</Link>
            </li>
            <Dropdown as="li" className="nav-item">
              <Dropdown.Toggle as={Link} to="#" className="nav-link dropdown-toggle">
                Add
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/add-author">Add Author</Dropdown.Item>
                <Dropdown.Item as={Link} to="/add-book">Add Book</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <li className="nav-item">
              <Link to="/search" className="nav-link">Search</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    </>
  );
}

export default Navbar;
