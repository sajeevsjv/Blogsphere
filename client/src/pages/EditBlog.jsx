import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar";

const EditBlog = () => {
  const { blogId } = useParams(); // Get the blogId from URL params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
    category: "",
    tags: "",
  });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalImage, setOriginalImage] = useState(null); // Store the original image

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:3005/categories", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error loading categories:", error.response || error);
        toast.error("Failed to load categories. Please try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const loadBlog = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(`http://localhost:3005/getsingleblog/${blogId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const blogData = response.data.data;
        setFormData({
          title: blogData.title,
          author: blogData.author,
          content: blogData.content,
          image: blogData.image,
          category: blogData.category,
          tags: blogData.tags.join(", "),
        });
        setOriginalImage(blogData.image); // Set the original image
      } catch (error) {
        console.error("Error loading blog details:", error.response || error);
        toast.error("Failed to load blog details. Please try again.");
      } finally {
        setIsLoadingBlog(false);
      }
    };

    loadCategories();
    loadBlog();
  }, [blogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Image size should not exceed 2MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setFormData((prevData) => ({ ...prevData, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { title, content, category, tags, image } = formData;

    if (!title || !content || !category) {
      toast.info("Please fill all the required fields!");
      setIsSubmitting(false);
      return;
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const dataToSend = {
      title,
      author: formData.author,
      content,
      category,
      tags: tagsArray,
      image: image || originalImage, // Use the new image or the original image
    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.put(`http://localhost:3005/updateblog/${blogId}`, dataToSend, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Blog updated successfully!");
      navigate(`/blogs`); // Redirect to the updated blog's page
    } catch (error) {
      console.error("Error updating blog:", error.response || error);
      toast.error("Failed to update the blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategories || isLoadingBlog) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-24 px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Edit Blog
        </h2>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl space-y-6 mx-auto bg-white p-6 rounded-lg shadow-md"
        >
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((item) => (
                <option key={item._id} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags, separated by commas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Image */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 font-semibold rounded-lg transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditBlog;