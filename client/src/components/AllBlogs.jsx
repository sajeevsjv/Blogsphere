import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AllBlogs = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");

        // Fetch categories
        const categoriesResponse = await axios.get("http://localhost:3005/categories", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setCategories(categoriesResponse.data.data);

        // Fetch all blogs
        const blogsResponse = await axios.get("http://localhost:3005/getallblogs", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setBlogs(blogsResponse.data.data);
        setFilteredBlogs(blogsResponse.data.data); // Display all blogs initially
      } catch (error) {
        console.error("Error loading data:", error.response || error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterBlogs(searchQuery, category);
  };

  // Handle search input
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterBlogs(query, selectedCategory);
  };

  // Filter blogs based on search query and selected category
  const filterBlogs = (query, category) => {
    let filtered = blogs;

    // Apply category filter if not "All"
    if (category !== "All") {
      filtered = filtered.filter((blog) => blog.category === category);
    }

    // Apply search filter
    if (query.trim() !== "") {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(query) || // Filter by title
          blog.category.toLowerCase().includes(query) || // Filter by category
          (blog.tags && blog.tags.some((tag) => tag.toLowerCase().includes(query))) // Filter by tags
      );
    }

    setFilteredBlogs(filtered);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center text-xl text-gray-500 mt-16">
        Loading blogs...
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 mt-16 min-h-screen">
        {/* Search and Category Filter */}
        <div className="p-4 md:mx-10 border-blue-100 border-b-[1px] mx-4 mt-6 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search by title, category, or tags"
            className="outline-none rounded-lg px-3 text-justify py-2 bg-gray-100 transition w-full md:w-1/2"
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Category Dropdown */}
          <div className="flex items-center">
            <h2 className="text-lg text-gray-800 mr-4">Browse By:</h2>
            <select
              className="outline-none rounded-lg px-3 py-2 bg-gray-100 transition"
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Blogs
          </h2>
          {filteredBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  onClick={() => navigate(`/viewpage/${blog._id}`, "_self")}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {/* Blog Image */}
                  {blog.image ? (
                    <img
                      src={`http://localhost:3005/${blog.image}`}
                      alt={blog.title || "Blog Cover"}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-500 text-xl">
                      No Image
                    </div>
                  )}
                  <div className="info text-sm px-4 py-2 flex text-gray-400 gap-1">
                    <span>by {blog.author?.name}</span>
                    <span>-</span>
                    <span>{formatDate(blog.createdAt)}</span>
                    <span >-</span>
                    <span>{blog.category}</span>
                  </div>
                  {/* Blog Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {blog.content?.slice(0, 100)}...
                    </p>
                  </div>
                  {/* Tags */}
                  <div className="px-4 pb-2">
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No blogs available for the search query.
            </p>
          )}
        </main>
      </div>
    </>
  );
};

export default AllBlogs;
