import { useState, useEffect, useContext } from "react";
import socket from "./Socket"
import { DataContext } from "./DataProvider";
import axios from "axios";
import EmojiPickerComponent from "./EmojiPickerComponent";



const CommentSection = () => {
  const { blogId } = useContext(DataContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user_id, setUser_id] = useState(localStorage.getItem("user_id"));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/comments/${blogId}`);
        if (response.data && response.data.data) {
          // Sort comments by latest first
          const sortedComments = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setComments(sortedComments);
        } else {
          throw new Error("No data found in response");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to load comments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchComments();
    }

    socket.on("commentAdded", (data) => {
      if (data.blogId === blogId) {
        setComments((prev) => {
          const addReply = (comments) =>
            comments.map((comment) => {
              if (comment._id === data.parentId) {
                return {
                  ...comment,
                  replies: [
                    ...(comment.replies || []),
                    data.comment,
                  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // Sort replies by latest first
                };
              }
              if (comment.replies) {
                return { ...comment, replies: addReply(comment.replies) };
              }
              return comment;
            });

          if (data.comment.parentId) {
            return addReply(prev);
          }

          // Sort main comments by latest first
          return [data.comment, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
      }
    });

    return () => socket.off("commentAdded");
  }, [blogId, user_id]);

  const handleEmojiSelect = (emoji) => {
    setNewComment((prev) => prev + emoji.native);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      if (!user_id) {
        return alert("You must be logged in to comment.");
      }
      socket.emit(
        "newComment",
        { blogId, comment: newComment, author: user_id },
        (error) => {
          if (error) {
            alert("Failed to submit comment. Please try again.");
          }
        }
      );
      setNewComment("");
    }
  };

  const handleReplySubmit = (parentId, replyText) => {
    if (replyText.trim()) {
      if (!user_id) {
        return alert("You must be logged in to reply.");
      }
      const replyData = {
        parentId,
        comment: replyText,
        author: user_id,
        blogId,
      };
      socket.emit("newComment", replyData, (error) => {
        if (error) {
          alert("Failed to submit reply. Please try again.");
        }
      });
    }
  };

  if (loading) return <div className="text-center text-xl text-gray-500">Loading comments...</div>;

  return (
    <div className="comment-section max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Comments ({comments.length})</h3>
        <div className="like-button">
          <input className="on" id="heart" type="checkbox" />
          <label className="like" htmlFor="heart">
            <svg
              className="like-icon"
              fillRule="nonzero"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
              ></path>
            </svg>
            <span className="like-text">Likes</span>
          </label>
          <span className="like-count one">68</span>
          <span className="like-count two">69</span>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="comment-input mt-4 space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <div className="flex items-center space-x-2">
          <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
        <CommentList comments={comments} onReplySubmit={handleReplySubmit} />
      </div>
    </div>
  );
};

const CommentList = ({ comments, onReplySubmit }) => {
  return (
    <div className="comments-list space-y-6">
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} onReplySubmit={onReplySubmit} />
        ))
      ) : (
        <div className="text-center text-gray-400">No comments yet. Be the first to comment!</div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, onReplySubmit }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Emoji picker for replies
  const user_id = localStorage.getItem("user_id");

  const handleReply = () => {
    onReplySubmit(comment._id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  const toggleReplies = () => {
    setShowReplies((prev) => !prev);
  };

  const handleEmojiSelect = (emoji) => {
    setReplyText((prev) => prev + emoji.native); // Add selected emoji to the reply text
  };

  const authorName = comment.author?._id === user_id ? "You" : comment.author?.name || "Anonymous";

  return (
    <div className="comment-item p-5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-500">{authorName}</p>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          at{" "}
          {new Date(comment.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p className="text-lg font-semibold text-gray-800 my-2">{comment.comment}</p>
      <button
        onClick={() => setShowReplyBox((prev) => !prev)}
        className="text-sm text-blue-500 hover:underline mt-3"
      >
        Reply
      </button>
      
      {showReplyBox && (
        <div className="reply-box mt-4">
          <div className="relative">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full p-4 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            {/* Emoji Picker Toggle Button */}
            <button
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="absolute top-2 right-2 text-xl"
            >
              😀
            </button>
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-10 right-0">
                <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
              </div>
            )}
          </div>
          <button
            onClick={handleReply}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Submit Reply
          </button>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <>
          <button
            onClick={toggleReplies}
            className="text-sm text-blue-500 hover:underline mt-3"
          >
            {showReplies ? "Hide Replies" : `View Replies (${comment.replies.length})`}
          </button>
          {showReplies && (
            <div className="replies mt-4 pl-6">
              {/* Sort replies by latest first */}
              <CommentList comments={comment.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} onReplySubmit={onReplySubmit} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
