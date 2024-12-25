import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blog = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      }
    };

    loadData();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) => blog.category === category);
      setFilteredBlogs(filtered);
    }
  };

  // Function to format date as string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 mt-16 min-h-screen">
        {/* Dropdown for "Browse By" */}
        <div className="p-4 md:mx-10 border-blue-100 border-b-[1px] mx-4 mt-6 rounded-lg flex justify-between items-center">
          <h2 className="text-lg text-gray-800">Browse By :</h2>
          <select
            className="outline-none rounded-lg px-3 text-justify py-2 bg-transparent transition"
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

        {/* Main Content */}
        <main className="p-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            {selectedCategory} Blogs
          </h2>
          {filteredBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
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
                  <div className="info px-4 py-2 flex gap-1">
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>-</span>
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
                </article>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              No blogs available in this category.
            </p>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
