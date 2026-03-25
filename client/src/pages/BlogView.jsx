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
      <div className="flex min-h-screen items-center justify-center bg-mesh-light pt-14 dark:bg-mesh-dark">
        <p className="text-sm font-medium text-violet-600 dark:text-fuchsia-300">Loading the good stuff…</p>
      </div>
    );
  }

  const blocks = blog.content_blocks?.length ? blog.content_blocks : [{ type: "text", value: blog.content }];

  return (
    <div className="min-h-screen bg-mesh-light pt-20 pb-16 dark:bg-mesh-dark">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="border-b border-violet-200/50 pb-10 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-violet-100 px-3 py-0.5 font-bold text-violet-800 ring-1 ring-inset ring-violet-300/50 dark:bg-fuchsia-950/50 dark:text-fuchsia-200 dark:ring-fuchsia-500/20">
              {blog.category}
            </span>
            {blog.createdAt && (
              <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}</time>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{blog.title}</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="text-slate-500 dark:text-slate-500">By </span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{blog?.author?.name || "Unknown author"}</span>
          </p>
          {(blog.tags || []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(blog.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-0.5 text-xs font-semibold text-violet-800 dark:border-fuchsia-800/50 dark:bg-fuchsia-950/30 dark:text-fuchsia-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {blog.image && (
            <img src={blog.image} alt="" className="mt-8 w-full rounded-3xl border border-violet-100 object-cover shadow-lg dark:border-slate-700" style={{ maxHeight: "420px" }} />
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                blog.liked_by_me
                  ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-200"
                  : "border-slate-200 text-slate-700 hover:bg-violet-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              {blog.liked_by_me ? (
                <HeartSolid className="h-4 w-4 text-fuchsia-600 dark:text-fuchsia-400" />
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
                <img key={idx} src={block.value} alt="" className="w-full rounded-2xl border border-violet-100 object-contain dark:border-slate-700" style={{ maxHeight: "24rem" }} />
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

      <section className="mx-auto mt-4 max-w-3xl border-t border-violet-200/50 px-4 pt-12 dark:border-slate-800 sm:px-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Comments</h2>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Drop your take — keep it kind.</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <input
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder="Say something real…"
            className="min-h-[44px] flex-1 rounded-2xl border border-violet-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            type="button"
            onClick={handleComment}
            className="rounded-full bg-btn-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-btn-primary-hover"
          >
            Post
          </button>
        </div>

        <ul className="mt-8 space-y-6">
          {(blog.comments || []).map((comment) => (
            <li key={comment._id} className="rounded-3xl border border-violet-100/90 bg-white/95 p-5 shadow-card ring-1 ring-violet-500/5 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-card-dark dark:ring-fuchsia-500/10">
              <p className="text-sm font-bold text-violet-900 dark:text-fuchsia-200">{comment.user_name || "Anonymous"}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{comment.text}</p>

              {(comment.replies || []).length > 0 && (
                <ul className="ml-4 mt-4 space-y-3 border-l-2 border-fuchsia-200 pl-4 dark:border-fuchsia-900/50">
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
                  className="min-h-10 flex-1 rounded-2xl border border-violet-200/80 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => handleReply(comment._id)}
                  className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-bold text-violet-800 transition hover:bg-violet-50 dark:border-fuchsia-800 dark:bg-slate-900 dark:text-fuchsia-200 dark:hover:bg-slate-800"
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
