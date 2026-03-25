import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ChatBubbleLeftRightIcon, HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import BlogHtmlContent from "../components/BlogHtmlContent";
import { isLikelyHtml } from "../utils/blogContent";

const BlogView = () => {
  const { blogId } = useParams();
  const authToken = localStorage.getItem("authToken");
  const [blog, setBlog] = useState(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});

  const fetchBlog = async () => {
    try {
      const response = await axios({
        url: `http://localhost:3005/blogs/${blogId}`,
        method: "GET",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      setBlog(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load article");
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [blogId]);

  const handleLike = async () => {
    if (!authToken) {
      toast.info("Please sign in to like this article");
      return;
    }
    try {
      await axios({
        url: `http://localhost:3005/blogs/${blogId}/like`,
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchBlog();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not update like");
    }
  };

  const handleComment = async () => {
    if (!commentDraft.trim()) return;
    try {
      await axios({
        url: `http://localhost:3005/blogs/${blogId}/comments`,
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        data: { text: commentDraft.trim() },
      });
      setCommentDraft("");
      fetchBlog();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not post comment");
    }
  };

  const handleReply = async (commentId) => {
    const text = (replyDrafts[commentId] || "").trim();
    if (!text) return;
    try {
      await axios({
        url: `http://localhost:3005/blogs/${blogId}/comments/${commentId}/replies`,
        method: "POST",
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        data: { text },
      });
      setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
      fetchBlog();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not post reply");
    }
  };

  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 pt-14 dark:bg-slate-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    );
  }

  const blocks = blog.content_blocks?.length ? blog.content_blocks : [{ type: "text", value: blog.content }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/80 pt-20 pb-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="border-b border-slate-200 pb-10 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-md bg-brand-50 px-2 py-0.5 font-medium text-brand-900 ring-1 ring-inset ring-brand-600/10 dark:bg-brand-950/50 dark:text-brand-200 dark:ring-brand-500/20">
              {blog.category}
            </span>
            {blog.createdAt && (
              <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</time>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{blog.title}</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-slate-500 dark:text-slate-500">By </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{blog?.author?.name || "Unknown author"}</span>
          </p>
          {(blog.tags || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(blog.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {blog.image && (
            <img src={blog.image} alt="" className="mt-8 w-full rounded-xl border border-slate-200 object-cover dark:border-slate-800" style={{ maxHeight: "420px" }} />
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                blog.liked_by_me
                  ? "border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-200"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              {blog.liked_by_me ? (
                <HeartSolid className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              ) : (
                <HeartIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              )}
              {blog.liked_by_me ? "Liked" : "Like"} · {blog.likes || 0}
            </button>
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              {(blog.comments || []).length} comments
            </span>
          </div>
        </header>

        <div className="py-10">
          <div className="space-y-8">
            {blocks.map((block, idx) =>
              block.type === "image" ? (
                <img key={idx} src={block.value} alt="" className="w-full rounded-lg border border-slate-200 object-contain dark:border-slate-800" style={{ maxHeight: "24rem" }} />
              ) : isLikelyHtml(block.value) ? (
                <BlogHtmlContent key={idx} html={block.value} className="text-slate-700 dark:text-slate-300" />
              ) : (
                <p key={idx} className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {block.value}
                </p>
              )
            )}
          </div>
        </div>
      </article>

      <section className="mx-auto mt-4 max-w-3xl border-t border-slate-200 px-4 pt-12 dark:border-slate-800 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Comments</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Join the discussion. Be respectful and concise.</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <input
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder="Write a comment…"
            className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={handleComment}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            Post
          </button>
        </div>

        <ul className="mt-8 space-y-6">
          {(blog.comments || []).map((comment) => (
            <li key={comment._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:shadow-card-dark">
              <p className="text-sm font-medium text-brand-900 dark:text-brand-200">{comment.user_name || "Anonymous"}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{comment.text}</p>

              {(comment.replies || []).length > 0 && (
                <ul className="ml-4 mt-4 space-y-3 border-l-2 border-brand-200 pl-4 dark:border-brand-900">
                  {(comment.replies || []).map((reply) => (
                    <li key={reply._id}>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{reply.user_name || "Anonymous"}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{reply.text}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  value={replyDrafts[comment._id] || ""}
                  onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                  placeholder="Reply…"
                  className="min-h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => handleReply(comment._id)}
                  className="rounded-lg border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-50 dark:border-brand-800 dark:bg-slate-900 dark:text-brand-200 dark:hover:bg-slate-800"
                >
                  Reply
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default BlogView;
