import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid justify-content-start">
        <a className="navbar-brand me-4" href="#"><b>Bitgesell Assessment</b></a>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link active" to="/">Items</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
