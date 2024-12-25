import { useState, useEffect } from "react";
import { useContext } from "react";
import Picker from "@emoji-mart/react";
import io from "socket.io-client";
import { DataContext } from "./DataProvider";
import axios from "axios";

const socket = io("http://localhost:3005");

const CommentSection = () => {
  const { blogId } = useContext(DataContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/comments/${blogId}`);
        setComments(response.data.data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();

    socket.on("commentAdded", (data) => {
      if (data.blogId === blogId) {
        setComments((prev) => [...prev, data.comment]);
      }
    });

    return () => socket.off("commentAdded");
  }, [blogId]);

  const handleEmojiSelect = (emoji) => {
    setNewComment((prev) => prev + emoji.native); // Append selected emoji
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      socket.emit("newComment", { blogId, comment: newComment, author: "Anonymous" });
      setNewComment(""); // Clear input field
    }
  };

  const handleReplySubmit = (parentId, replyText) => {
    if (replyText.trim()) {
      const replyData = {
        parentId,
        comment: replyText,
        author: "Anonymous", // Replace with actual author name if available
        blogId,
      };
      socket.emit("newComment", replyData); // Reuse the same event for replies
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      <CommentList comments={comments} onReplySubmit={handleReplySubmit} />
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-textarea"
        />
        <button onClick={() => setShowPicker((prev) => !prev)} className="emoji-picker-btn">
          😊
        </button>
        {showPicker && <Picker onEmojiSelect={handleEmojiSelect} />}
        <button onClick={handleCommentSubmit} className="submit-btn">
          Submit
        </button>
      </div>
    </div>
  );
};

const CommentList = ({ comments, onReplySubmit }) => {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onReplySubmit={onReplySubmit} />
      ))}
    </div>
  );
};

const CommentItem = ({ comment, onReplySubmit }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    onReplySubmit(comment.id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item">
      <p>
        <strong>{comment.author}</strong>: {comment.comment}
      </p>
      <span>{new Date(comment.date).toLocaleString()}</span>
      <button onClick={() => setShowReplyBox((prev) => !prev)} className="reply-btn">
        Reply
      </button>
      {showReplyBox && (
        <div className="reply-box">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="reply-textarea"
          />
          <button onClick={handleReply} className="submit-reply-btn">
            Submit
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <CommentList comments={comment.replies} onReplySubmit={onReplySubmit} />
      )}
    </div>
  );
};

export default CommentSection;
