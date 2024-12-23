const mongoose = require('mongoose');

const blogsSchema = mongoose.Schema(
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
      ref: 'users',
    },
    category: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
        required: false,
      },
    ],
    image: String,
    likes: {
      type: Number,
      default: 0,
    },
    comments: Array,
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('blogs', blogsSchema);
