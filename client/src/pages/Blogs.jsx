import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChatBubbleLeftRightIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { stripHtmlToText, isLikelyHtml } from "../utils/blogContent";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios({
        url: "http://localhost:3005/blogs",
        method: "GET",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      setBlogs(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load blogs");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleToggleLike = async (blogId) => {
    if (!authToken) {
      toast.info("Please sign in to like articles");
      return;
    }
    try {
      await axios({
        url: `http://localhost:3005/blogs/${blogId}/like`,
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchBlogs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update like");
    }
  };

  const previewFromBlog = (blog) => {
    const blocks = blog.content_blocks?.length ? blog.content_blocks : [{ type: "text", value: blog.content }];
    const firstText = blocks.find((b) => b.type === "text" && b.value)?.value || "";
    if (isLikelyHtml(firstText)) {
      const t = stripHtmlToText(firstText);
      return t.length > 200 ? `${t.slice(0, 200)}…` : t;
    }
    const raw = firstText || "";
    return raw.length > 200 ? `${raw.slice(0, 200)}…` : raw;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/80 pt-20 pb-14 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10 flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Articles</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Latest posts from the community.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/addblog")}
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            New article
          </button>
        </header>

        {blogs.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">No articles yet. Publish the first one.</p>
          </div>
        )}

        <ul className="space-y-6">
          {blogs.map((blog) => {
            const previewText = previewFromBlog(blog) || "Continue reading…";

            return (
              <li key={blog._id}>
                <article className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card transition hover:border-slate-300/90 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark dark:hover:border-slate-700">
                  {blog.image && (
                    <button type="button" onClick={() => navigate(`/blogs/${blog._id}`)} className="block w-full text-left">
                      <img src={blog.image} alt="" className="h-48 w-full object-cover" />
                    </button>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="rounded-md bg-brand-50 px-2 py-0.5 font-medium text-brand-900 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-950/50 dark:text-brand-200 dark:ring-brand-500/20">
                        {blog.category}
                      </span>
                      {blog.createdAt && <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>}
                    </div>

                    <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      <button
                        type="button"
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="text-left transition hover:text-brand-700 dark:hover:text-brand-400"
                      >
                        {blog.title}
                      </button>
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{blog?.author?.name || "Unknown author"}</p>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{previewText}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(blog._id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                          blog.liked_by_me
                            ? "border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {blog.liked_by_me ? (
                          <HeartSolid className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                        ) : (
                          <HeartIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        )}
                        {blog.likes || 0}
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        {(blog.comments || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="ml-auto text-sm font-medium text-brand-700 transition hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300"
                      >
                        Read article
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Blogs;
