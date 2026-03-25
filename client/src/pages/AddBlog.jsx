import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: null,
    category: "",
    tags: "",
  });
  const [editorHtml, setEditorHtml] = useState("");

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link", "image"],
        ["blockquote", "code-block"],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "blockquote",
    "code-block",
    "align",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "image") {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, category, tags, image } = formData;
    const plain = editorHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (!title || !category || !plain) {
      toast.info("Add a title, category, and body content.");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const authToken = localStorage.getItem("authToken");
      await axios({
        url: `${import.meta.env.VITE_API_URL}/blogs`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          title,
          content: editorHtml,
          content_blocks: [],
          category,
          tags: tagsArray,
          image,
        },
      });
      toast.success("Article published.");
      setFormData({
        title: "",
        image: null,
        category: "",
        tags: "",
      });
      setEditorHtml("");
      navigate("/blogs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not publish");
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-violet-200/80 bg-white/95 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100";

  return (
    <div className="min-h-screen bg-mesh-light pt-20 pb-16 dark:bg-mesh-dark">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10 border-b border-violet-200/50 pb-8 dark:border-slate-800">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Compose your <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">drop</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            Rich text, images, code — everything saves when you hit publish.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Article title" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Category <span className="text-red-500">*</span>
            </label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className={inputClass} required>
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Body <span className="text-red-500">*</span>
            </span>
            <div className="overflow-hidden rounded-2xl border border-violet-200/80 bg-white ring-1 ring-violet-500/10 dark:border-slate-600 dark:bg-slate-900 dark:ring-fuchsia-500/10">
              <ReactQuill theme="snow" value={editorHtml} onChange={setEditorHtml} modules={modules} formats={formats} placeholder="Start writing…" />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Tags <span className="font-normal text-slate-500">(optional, comma-separated)</span>
            </label>
            <input type="text" id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. design, engineering" className={inputClass} />
          </div>

          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Cover image <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="block w-full text-sm font-medium text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-btn-primary file:px-4 file:py-2 file:text-sm file:font-bold file:text-white file:shadow-md hover:file:bg-btn-primary-hover dark:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-violet-200/50 pt-8 dark:border-slate-800 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Never mind
            </button>
            <button
              type="submit"
              className="rounded-full bg-btn-primary px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-btn-primary-hover"
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
