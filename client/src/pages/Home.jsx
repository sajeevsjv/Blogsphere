import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // Manage visibility of filtered blogs

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3005/getallblogs", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setBlogs(response.data.data);
        setFilteredBlogs(response.data.data); // Display all blogs initially
      } catch (error) {
        console.error("Error loading blogs:", error.response || error);
        toast.error("Failed to load blogs. Please try again.");
      }
    };

    loadBlogs();
  }, []);

  // Handle search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowerCaseQuery) ||
        (blog.tags && blog.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery))) ||
        (blog.category && blog.category.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredBlogs(filtered);
    setIsSearchActive(query.length > 0); // Set the visibility based on search query
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 mt-12 min-h-screen">
        {/* Search Section */}
        <div className="py-5 px-6 bg-gradient-to-r from-sky-300 to-indigo-600 md:px-12 lg:px-20">
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search blogs by title, tags, or category"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="home_search w-full max-w-3xl px-4 py-3 focus:outline-none rounded-md ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Search Results Section */}
        {isSearchActive && (
          <div className="py-16 px-6 md:px-12 lg:px-20">
            <h2 className="text-3xl font-semibold text-gray-800 text-center">Search Results</h2>
            <p className="text-gray-600 text-center mt-2">Here are the blogs matching your search.</p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs?.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    {/* Conditional Image Rendering */}
                    {blog.image ? (
                      <img
                        src={`http://localhost:3005/${blog.image}`}
                        alt={blog.title || "Blog Cover"}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-semibold">
                        {blog.title ? blog.title.slice(0, 15) + "..." : "No Image"}
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-gray-500 text-sm space-x-2 mb-2">
                        <time>
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span>•</span>
                        <span>{blog.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                      <p className="text-gray-600 mt-2">
                        {blog.content?.slice(0, 140) || "No content available"}...
                      </p>
                      <Link
                        to={`/viewpage/${blog._id}`}
                        className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-gray-500 text-center">No blogs match your search.</p>
              )}
            </div>
          </div>
        )}

        {/* Explore Blogs Section (Always visible) */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-28 px-6 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Welcome to BlogSphere</h1>
          <p className="mt-4 text-lg md:text-xl">
            Dive into the world of ideas, stories, and insights shared by amazing writers.
          </p>
          <button
            onClick={() => navigate("/blogs")}
            className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Explore Blogs
          </button>
        </div>

        {/* Featured Blogs Section (Below the blue banner) */}
        <div className="py-16 px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">Featured Blogs</h2>
          <p className="text-gray-600 text-center mt-2">Check out our most popular and engaging articles.</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs?.length > 0 ? (
              blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Conditional Image Rendering */}
                  {blog.image ? (
                    <img
                      src={`http://localhost:3005/${blog.image}`}
                      alt={blog.title || "Blog Cover"}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl font-semibold">
                      {blog.title ? blog.title.slice(0, 15) + "..." : "No Image"}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-gray-500 text-sm space-x-2 mb-2">
                      <time>
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span>•</span>
                      <span>{blog.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{blog.title}</h3>
                    <p className="text-gray-600 mt-2">
                      {blog.content?.slice(0, 140) || "No content available"}...
                    </p>
                    <Link
                      to={`/viewpage/${blog._id}`}
                      className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500 text-center">No blogs available.</p>
            )}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-blue-50 py-16 px-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Start Your Journey with BlogSphere</h2>
          <p className="text-gray-600 mt-2">
            Join our community of bloggers and readers. Share your thoughts, ideas, and stories!
          </p>
          <button
            onClick={() => navigate("/addblog")}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition"
          >
            Write a Blog
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
