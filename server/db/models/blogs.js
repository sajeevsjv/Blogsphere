const mongoose = require('mongoose');

const blogs = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: true,
   },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String
      }
    ],
    image: String,
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('blogs', blogs);
