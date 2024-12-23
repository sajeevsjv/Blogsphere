import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AddBlog = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const setDefaultAuthor = () => {
      const userName = localStorage.getItem("userName");
      if (userName) {
        setFormData((prevData) => ({ ...prevData, author: userName }));
      }
    };

    loadCategories();
    setDefaultAuthor();
  }, []);

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

    const { title, content, category, tags, image, author } = formData;
    const user_id = localStorage.getItem("user_id");


    if (!title || !content || !category) {
      toast.info("Please fill all the required fields!");
      setIsSubmitting(false);
      return;
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim());

    const dataToSend = {
      title,
      author : user_id,
      content,
      category,
      tags: tagsArray,
      image,

    };

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post("http://localhost:3005/addblog", dataToSend, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Blog added successfully!");
      setFormData({
        title: "",
        author: formData.author, // Retain author
        content: "",
        image: null,
        category: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error submitting blog:", error.response || error);
      toast.error("Failed to submit the blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCategories) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Create a New Blog
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
          {isSubmitting ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
