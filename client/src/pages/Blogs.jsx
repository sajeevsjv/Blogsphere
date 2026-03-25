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
    <div className="min-h-screen bg-mesh-light pt-20 pb-14 dark:bg-mesh-dark">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="mb-10 flex flex-col gap-4 border-b border-violet-200/50 pb-8 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              The <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">feed</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">Fresh posts from the community — newest first.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/addblog")}
            className="shrink-0 rounded-full bg-btn-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-btn-primary-hover"
          >
            New drop
          </button>
        </header>

        {blogs.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-violet-200/80 bg-white/80 py-16 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Nothing here yet — be the first to post.</p>
          </div>
        )}

        <ul className="space-y-6">
          {blogs.map((blog) => {
            const previewText = previewFromBlog(blog) || "Continue reading…";

            return (
              <li key={blog._id}>
                <article className="overflow-hidden rounded-3xl border border-violet-100/90 bg-white/95 shadow-card ring-1 ring-violet-500/5 transition hover:-translate-y-0.5 hover:border-fuchsia-200/80 hover:shadow-glow dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-card-dark dark:ring-fuchsia-500/10 dark:hover:border-fuchsia-500/30 dark:hover:shadow-glow-dark">
                  {blog.image && (
                    <button type="button" onClick={() => navigate(`/blogs/${blog._id}`)} className="block w-full text-left">
                      <img src={blog.image} alt="" className="h-48 w-full object-cover" />
                    </button>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="rounded-full bg-violet-100 px-3 py-0.5 font-bold text-violet-800 ring-1 ring-inset ring-violet-300/50 dark:bg-fuchsia-950/50 dark:text-fuchsia-200 dark:ring-fuchsia-500/20">
                        {blog.category}
                      </span>
                      {blog.createdAt && <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>}
                    </div>

                    <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      <button
                        type="button"
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="text-left transition hover:text-violet-700 dark:hover:text-fuchsia-300"
                      >
                        {blog.title}
                      </button>
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{blog?.author?.name || "Unknown author"}</p>

                    <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{previewText}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-violet-100 pt-5 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => handleToggleLike(blog._id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                          blog.liked_by_me
                            ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-200"
                            : "border-slate-200 text-slate-700 hover:bg-violet-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {blog.liked_by_me ? (
                          <HeartSolid className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
                        ) : (
                          <HeartIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        )}
                        {blog.likes || 0}
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        {(blog.comments || []).length}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/blogs/${blog._id}`)}
                        className="ml-auto text-sm font-bold text-violet-700 transition hover:text-fuchsia-600 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
                      >
                        Read it
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
