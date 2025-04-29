import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyBlogs = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userId = localStorage.getItem("user_id"); 

        const response = await axios.get(`http://localhost:3005/myblogs/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setMyBlogs(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading my blogs:", error.response || error);
        toast.error("Failed to load your blogs. Please try again.");
        setLoading(false);
      }
    };

    loadMyBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6 md:px-12 lg:px-20">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            My Blogs
          </h2>

          {loading ? (
            <p className="text-center text-gray-500">Loading your blogs...</p>
          ) : myBlogs.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {myBlogs.map((blog) => (
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
                  <div className="text-sm px-4 text-gray-500 mt-2">
                      Category: {blog.category || "Uncategorized"} |{" "}
                      {formatDate(blog.createdAt)}
                    </div>
                  {/* Blog Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {blog.content?.slice(0, 100)}...
                    </p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Link
                        to={`/viewpage/${blog._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Read More
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => navigate("/editblog/" + blog._id)}
                        className="text-red-500 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">You haven't written any blogs yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );

  async function handleDelete(blogId) {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const authToken = localStorage.getItem("authToken");

      await axios.delete(`http://localhost:3005/deleteblog/${blogId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setMyBlogs(myBlogs.filter((blog) => blog._id !== blogId));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error.response || error);
      toast.error("Failed to delete the blog. Please try again.");
    }
  }
};

export default MyBlogs;
