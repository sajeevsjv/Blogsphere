const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        user_name: {
            type: String,
            trim: true
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const commentSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        user_name: {
            type: String,
            trim: true
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        replies: {
            type: [replySchema],
            default: []
        }
    },
    { _id: false }
);

const blogs = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        content_blocks: {
            type: [
                {
                    type: {
                        type: String,
                        enum: ["text", "image"],
                        required: true
                    },
                    value: {
                        type: String,
                        required: true
                    }
                }
            ],
            default: []
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        category: {
            type: String,
            required: true
        },
        tags: {
            type: [String],
            default: []
        },
        image: String,
        likes: {
            type: Number,
            default: 0
        },
        liked_by: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "users",
            default: []
        },
        comments: {
            type: [commentSchema],
            default: []
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("blogs", blogs);