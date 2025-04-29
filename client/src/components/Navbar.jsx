import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { DataContext } from "../components/DataProvider";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(DataContext);

  // Set login state based on localStorage
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b-[1px] top-0 fixed w-full z-10">
      <div className="container mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
        {/* Left Section: Navigation Links */}
        <div className="hidden w-[45%] md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Home
          </Link>
          <Link to="/blogs" className="text-gray-700 hover:text-blue-600 transition font-medium">
            Blogs
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">
            About
          </Link>
          {isLoggedIn
            ? <Link to="/myblogs" className="text-gray-700 hover:text-blue-600 transition font-medium">My Blogs</Link>
            : null}
        </div>

        {/* Center Section: Logo */}
        <div className="text-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            BlogSphere
          </Link>
        </div>

        {/* Right Section: Sign In / Sign Up */}
        <div className="hidden md:flex space-x-10 w-[45%]   justify-end">
          {isLoggedIn ? (
            <>
           <button className="bg-gradient-to-r from-sky-300 to-indigo-600  text-white rounded-md px-3" onClick={()=>navigate("/addblog")}>+ Add your blog</button>
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center focus:outline-none">
                <img
                  alt="User"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="w-8 h-8 rounded-full"
                />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5">
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Your Profile
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        localStorage.removeItem("authToken");
                        setIsLoggedIn(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-sky-300 to-indigo-600  text-white rounded-lg font-medium hover:bg-blue-600 transition"
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
          <Link to="/blogs" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsOpen(false)}>
            Blogs
          </Link>
          <Link to="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-100" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-blue-600 hover:bg-blue-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                localStorage.removeItem("authToken");
                setIsLoggedIn(false);
              }}
              className="block px-4 py-2 text-red-600 hover:bg-red-100 font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
