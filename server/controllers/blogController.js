const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categoriesModel = require("../db/models/categories");
const blogs = require("../db/models/blogs");

const getTokenUserId = (req) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        const token = authHeader.split(" ")[1];
        if (!token || token === "null" || token === "undefined") return null;
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        return decoded.user_id;
    } catch (error) {
        return null;
    }
};

exports.loadCategories = async (req, res) => {
    try {
        const allCategories = await categoriesModel.find();
        const response = success_function({
            statusCode: 200,
            data: allCategories
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.createBlog = async (req, res) => {
    try {
        const body = req.body;
        const userId = body.author || getTokenUserId(req);
        const contentBlocks = Array.isArray(body.content_blocks) ? body.content_blocks : [];
        const normalizedBlocks = contentBlocks.filter(
            (block) => block && ["text", "image"].includes(block.type) && typeof block.value === "string" && block.value.trim()
        );
        const derivedContent = normalizedBlocks
            .filter((block) => block.type === "text")
            .map((block) => block.value.trim())
            .join("\n\n");

        const createdBlog = await blogs.create({
            title: body.title,
            content: body.content || derivedContent || "Untitled content",
            content_blocks: normalizedBlocks,
            author: userId,
            category: body.category,
            tags: Array.isArray(body.tags) ? body.tags : [],
            image: body.image
        });

        const response = success_function({
            statusCode: 201,
            data: createdBlog,
            message: "Blog created successfully"
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const currentUserId = getTokenUserId(req);
        const allBlogs = await blogs
            .find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });
        const blogsWithLikeState = allBlogs.map((blog) => {
            const doc = blog.toObject();
            doc.liked_by_me = currentUserId
                ? (doc.liked_by || []).some((id) => id.toString() === currentUserId.toString())
                : false;
            return doc;
        });
        const response = success_function({
            statusCode: 200,
            data: blogsWithLikeState
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.getSingleBlog = async (req, res) => {
    try {
        const currentUserId = getTokenUserId(req);
        const blog = await blogs.findById(req.params.blogId).populate("author", "name email");

        if (!blog) {
            const response = error_function({
                statusCode: 404,
                message: "Blog not found"
            });
            return res.status(response.statusCode).send(response);
        }

        const doc = blog.toObject();
        doc.liked_by_me = currentUserId
            ? (doc.liked_by || []).some((id) => id.toString() === currentUserId.toString())
            : false;

        const response = success_function({
            statusCode: 200,
            data: doc
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.addComment = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const { text, user_name } = req.body;
        const userId = getTokenUserId(req);
        const user = userId ? await users.findById(userId) : null;

        const updated = await blogs.findByIdAndUpdate(
            blogId,
            {
                $push: {
                    comments: {
                        _id: new mongoose.Types.ObjectId(),
                        text,
                        user_id: userId || null,
                        user_name: user_name || (user ? user.name : "Anonymous"),
                        created_at: new Date(),
                        replies: []
                    }
                }
            },
            { new: true }
        );

        if (!updated) {
            const response = error_function({
                statusCode: 404,
                message: "Blog not found"
            });
            return res.status(response.statusCode).send(response);
        }

        const response = success_function({
            statusCode: 200,
            data: updated,
            message: "Comment added"
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.addReply = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
        const { text, user_name } = req.body;
        const userId = getTokenUserId(req);
        const user = userId ? await users.findById(userId) : null;

        const updated = await blogs.findOneAndUpdate(
            { _id: blogId, "comments._id": commentId },
            {
                $push: {
                    "comments.$.replies": {
                        _id: new mongoose.Types.ObjectId(),
                        text,
                        user_id: userId || null,
                        user_name: user_name || (user ? user.name : "Anonymous"),
                        created_at: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updated) {
            const response = error_function({
                statusCode: 404,
                message: "Blog or comment not found"
            });
            return res.status(response.statusCode).send(response);
        }

        const response = success_function({
            statusCode: 200,
            data: updated,
            message: "Reply added"
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const userId = getTokenUserId(req);

        if (!userId) {
            const response = error_function({
                statusCode: 401,
                message: "Please login to like a blog"
            });
            return res.status(response.statusCode).send(response);
        }

        const blog = await blogs.findById(blogId);
        if (!blog) {
            const response = error_function({
                statusCode: 404,
                message: "Blog not found"
            });
            return res.status(response.statusCode).send(response);
        }

        const hasLiked = blog.liked_by.some((id) => id.toString() === userId.toString());

        if (hasLiked) {
            blog.liked_by = blog.liked_by.filter((id) => id.toString() !== userId.toString());
        } else {
            blog.liked_by.push(userId);
        }

        blog.likes = blog.liked_by.length;
        await blog.save();

        const response = success_function({
            statusCode: 200,
            data: {
                blog_id: blog._id,
                likes: blog.likes,
                liked: !hasLiked
            },
            message: !hasLiked ? "Blog liked" : "Like removed"
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = error_function({
            statusCode: 400,
            message: error.message ? error.message : error
        });
        return res.status(response.statusCode).send(response);
    }
};


