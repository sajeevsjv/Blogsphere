import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">About BlogSphere</h4>
            <p className="text-sm">
              BlogSphere is your gateway to diverse blogs, ideas, and stories from around the world. Stay inspired and connected with our curated content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/blogs" className="hover:text-blue-400 transition">
                  Blogs
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54v-2.21c0-2.51 1.493-3.89 3.776-3.89 1.094 0 2.239.195 2.239.195v2.464h-1.26c-1.243 0-1.63.772-1.63 1.562v1.879h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.836 9.836 0 01-2.827.775 4.932 4.932 0 002.165-2.724 9.868 9.868 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482A13.966 13.966 0 011.671 3.15a4.92 4.92 0 001.523 6.573 4.903 4.903 0 01-2.23-.616v.061a4.92 4.92 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.923 4.923 0 004.6 3.417 9.869 9.869 0 01-6.102 2.105c-.396 0-.788-.023-1.177-.068a13.978 13.978 0 007.557 2.212c9.054 0 14.001-7.496 14.001-13.986 0-.21 0-.423-.016-.634A9.935 9.935 0 0024 4.557z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.96.24 2.667.512a5.374 5.374 0 011.947 1.28 5.374 5.374 0 011.28 1.947c.272.707.456 1.497.512 2.667.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.96-.512 2.667a5.374 5.374 0 01-1.28 1.947 5.374 5.374 0 01-1.947 1.28c-.707.272-1.497.456-2.667.512-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.96-.24-2.667-.512a5.374 5.374 0 01-1.947-1.28 5.374 5.374 0 01-1.28-1.947c-.272-.707-.456-1.497-.512-2.667C2.175 15.583 2.163 15.204 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.96.512-2.667a5.374 5.374 0 011.28-1.947A5.374 5.374 0 015.903 2.675c.707-.272 1.497-.456 2.667-.512C8.417 2.175 8.797 2.163 12 2.163m0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.157.246-2.91.512a7.43 7.43 0 00-2.72 1.564A7.43 7.43 0 00.675 5.903c-.266.753-.454 1.634-.512 2.91C.012 9.333 0 9.741 0 12c0 3.259.012 3.667.07 4.947.058 1.276.246 2.157.512 2.91a7.43 7.43 0 001.564 2.72 7.43 7.43 0 002.72 1.564c.753.266 1.634.454 2.91.512 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.157-.246 2.91-.512a7.43 7.43 0 002.72-1.564 7.43 7.43 0 001.564-2.72c.266-.753.454-1.634.512-2.91.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.246-2.157-.512-2.91a7.43 7.43 0 00-1.564-2.72A7.43 7.43 0 0018.097.675c-.753-.266-1.634-.454-2.91-.512C15.667.012 15.259 0 12 0z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.18a4.018 4.018 0 110-8.036 4.018 4.018 0 010 8.036zM18.406 4.594a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-700" />

        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
