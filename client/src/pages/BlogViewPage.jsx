import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogViewPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch blog details
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/getsingleblog/${id}`);
        setBlog(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch blog details");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

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
    <div className="container mx-auto px-6 py-8">
      <article className="bg-white rounded-lg shadow-md p-6">
        {/* Blog Cover Image */}
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title || "Blog Cover"}
            className="w-full h-64 object-cover rounded-md mb-6"
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
          <span> • </span>
          <span>{blog.category}</span>
        </div>

        {/* Blog Content */}
        <div className="text-gray-700 leading-relaxed space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Blog Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Likes and Comments */}
        <div className="mt-8">
          <p className="text-gray-600">
            <strong>Likes:</strong> {blog.likes}
          </p>
          <p className="text-gray-600 mt-4">
            <strong>Comments:</strong> {blog.comments?.length || 0}
          </p>
        </div>
      </article>
    </div>
  );
};

export default BlogViewPage;
