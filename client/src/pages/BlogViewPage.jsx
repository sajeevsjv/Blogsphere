import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import CommentSection from "../components/CommentSection";
import { useContext } from "react";
import { DataContext } from "../components/DataProvider";

const BlogViewPage = () => {
  const { blogId, setBlogId } = useContext(DataContext);
  const { id } = useParams(); // Get the blog ID from the URL
  setBlogId(id);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog details
    const fetchBlog = async () => {
      try {
        console.log("fetchblog working...");
        const response = await axios.get(`http://localhost:3005/getsingleblog/${id}`);
        console.log("response :", response.data.data);
        setBlog(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch blog details");
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading blog...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-gray-500">Blog not found.</p>;
  }

  // Convert blog content into paragraphs
  const paragraphs = blog.content.split("\n").filter((p) => p.trim() !== "");

  return (
    <>
      <Navbar />
      <div className="container mx-auto  mt-16 px-6 py-8">
        <article className="bg-white rounded-lg shadow-md p-6">
          {/* Blog Cover Image */}
          {blog.image ? (
            <img
              src={`http://localhost:3005/${blog.image}` || "Blog Cover"}
              alt={blog.title || "Blog Cover"}
              className="w-full h-96 object-fill rounded-md mb-6"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-semibold rounded-md mb-6">
              {blog.title.slice(0, 20)}...
            </div>
          )}

          {/* Blog Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>

          {/* Blog Meta Information */}
          <div className="text-gray-500 text-sm mb-6">
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-md"> • </span>
            <span>{blog.category}</span>
          </div>

          {/* Blog Content */}
          <div className="text-gray-700 leading-relaxed space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Blog Tags */}
          <div>
            {blog.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-6" aria-label="Blog tags">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-6">No tags available</p>
            )}
          </div>


          {/* Likes and Comments */}
          <div className="mt-8  w-full flex  justify-center  p-0  items-start">
            <div className="comments-container w-[60%]">
            <CommentSection />
            </div>
        

          </div>
          

        </article>
      </div>
    </>
  );
};

export default BlogViewPage;
