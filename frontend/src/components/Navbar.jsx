import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">My Blog</Link>
        <div>
          <Link to="/" className="mr-4 hover:text-gray-300">Home</Link>
          <Link to="/login" className="hover:text-gray-300">Admin Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;