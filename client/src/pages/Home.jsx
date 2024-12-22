import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Home = () => {

  const navigate = useNavigate();
  
  return (
    <>
    <Navbar />
    <div className="bg-gray-50 mt-16  min-h-screen">
      {/* Hero Section */}
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

      {/* Featured Blogs Section */}
      <div className="py-16 px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">Featured Blogs</h2>
        <p className="text-gray-600 text-center mt-2">Check out our most popular and engaging articles.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Example blog cards */}
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`https://via.placeholder.com/300x200?text=Blog+Image+${index + 1}`}
                alt="Blog Cover"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Blog Title {index + 1}
                </h3>
                <p className="text-gray-600 mt-2">
                  A brief description of the blog content goes here. Keep it engaging and concise!
                </p>
                <button
                  onClick={() => navigate(`/blog/${index + 1}`)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
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
