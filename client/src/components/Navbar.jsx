import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../components/DataProvider";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(DataContext);


  return (
    <nav className="bg-white shadow-md top-0 fixed  w-full">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Section: Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/blogs"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Blogs
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-blue-600 transition font-medium"
          >
            Contact
          </Link>
        </div>

        {/* Center Section: Logo */}
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BlogSphere
          </Link>
        </div>

        {/* Right Section: Sign In / Sign Up */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <Link
              to="/profile"
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
            >
              My Profile
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>


        {/* Hamburger Menu for Mobile */}
        <div className="block md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-800 hover:text-blue-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200">
          <Link
            to="/blogs"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/signin"
            className="block px-4 py-2 text-gray-700 hover:bg-blue-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="block px-4 py-2 text-blue-600 hover:bg-blue-200 font-medium transition"
            onClick={() => setIsOpen(false)}
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
