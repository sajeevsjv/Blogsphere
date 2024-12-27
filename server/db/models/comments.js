const mongoose = require("mongoose");

// Define the reply schema
const replySchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments", // Use comments collection to reference sub-replies
      },
    ],
    likes : {
      type : Number,
      default : 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Define the comments schema
const comments = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogs",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes : {
      type : Number,
      default : 0
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
      default: null, // Null for top-level comments
    },
    replies: [replySchema], // Embeds replies as an array of subdocuments
  },
  {
    timestamps: true,
  }
);

// Export the comments model
module.exports = mongoose.model("comments", comments);
