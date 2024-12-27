const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const blogs = require("../db/models/blogs");
const Comment = require("../db/models/comments"); // Assuming comments are in a separate model
const fileUpload = require("../utils/file-upload").fileUpload;
const sendEmail = require("../utils/send-email").sendEmail;


exports.loadCategories = async (req, res) => {
  try {
    let allcategories = await categories.find();
    if (allcategories) {
      let response = success_function({
        statusCode: 200,
        data: allcategories
      })
      return res.status(response.statusCode).send(response);
    }

  }
  catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    })
    return res.status(response.statusCode).send(response);
  }

}

exports.addBlog = async (req, res) => {
  try {
    let data = req.body;
    let title = data.title;
    let content = data.content;
    let category = data.category;
    let image = data.image;

    if (!title || !content || !category) {
      let response = error_function({
        statusCode: 400,
        message: "Title, Content and Category are required"
      })
      return res.status(response.statusCode).send(response);
    }

    if (image) {
      let image = req.body.image;
      //image validation
      let regExp = /^data:/;
      let result = regExp.test(image);


      if (result) {
        let img_path = await fileUpload(image, "users");
        console.log("img_path :", img_path);
        data.image = img_path;
      }
      else {
        let response = error_function({
          statusCode: 400,
          message: 'Invalid profile url'
        });
        res.status(response.statusCode).send(response);
        return;

      }

      const createblog = await blogs.create(data);
      if (createblog) {
        let response = success_function({
          statusCode: 200,
          message: "Blog added successfully"
        })
        return res.status(response.statusCode).send(response);
      }
    }

  }
  catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    })
    return res.status(response.statusCode).send(response);
  }
}

exports.getAllBlogs = async (req, res) => {
  try {
    const allblogs = await blogs.find();
    let response = success_function({
      statusCode: 200,
      data: allblogs
    })
    return res.status(response.statusCode).send(response);
  }
  catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : "an error occured while fetching all blogs"
    })
    return res.status(response.statusCode).send(response);
  }

}



exports.getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      const response = error_function({
        statusCode: 400,
        message: "Blog ID is required",
      });
      return res.status(response.statusCode).send(response);
    }

    // Find blog by ID
    const blog = await blogs.findOne({ _id: id });

    if (!blog) {
      const response = error_function({
        statusCode: 404,
        message: "Blog not found",
      });
      return res.status(response.statusCode).send(response);
    }

    const response = success_function({
      statusCode: 200,
      data: blog,
    });
    return res.status(response.statusCode).send(response);
  } catch (error) {
    console.error(error);
    const response = error_function({
      statusCode: 500,
      message: error.message || "Internal Server Error",
    });
    return res.status(response.statusCode).send(response);
  }
};


exports.myblogs = async (req, res) => {
  try {
    let user_id = req.params.id;
    let myblogs = await blogs.find({ author: user_id });
    if (myblogs) {
      let response = success_function({
        statusCode: 200,
        data: myblogs
      })
      return res.status(response.statusCode).send(response);
    }
  }
  catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    })
    return res.status(response.statusCode).send(response);
  }
}

exports.deleteBlog = async (req, res) => {
  try {
    let blog_id = req.params.id;

    // Attempt to delete the blog
    let deleteblog = await blogs.deleteOne({ _id: blog_id });

    // Check if a blog was deleted
    if (deleteblog.deletedCount > 0) {
      let response = success_function({
        statusCode: 200,
        message: "Blog deleted successfully"
      });
      return res.status(response.statusCode).send(response);
    } else {
      // Handle case when no blog was found
      let response = error_function({
        statusCode: 404,
        message: "Blog not found"
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    });
    return res.status(response.statusCode).send(response);
  }
};

exports.updateBlog = async (req, res) => {
  try {
    let blog_id = new mongoose.Types.ObjectId(req.params.id);
    let data = req.body;

    // Validate required fields
    if (!data.title || !data.content || !data.category) {
      let response = error_function({
        statusCode: 400,
        message: "Title, Content, and Category are required"
      });
      return res.status(response.statusCode).send(response);
    }

    // Image validation and processing
    if (data.image) {
      let regExp = /^data:/;
      if (regExp.test(data.image)) {
        let img_path = await fileUpload(data.image, "users");
        data.image = img_path;
        return;
      }
    }

    // Debug logs
    console.log("Filter:", { _id: blog_id });
    console.log("Update Data:", data);

    let updateblog = await blogs.updateOne({ _id: blog_id }, { $set: data });

    if (updateblog.matchedCount === 0) {
      let response = error_function({
        statusCode: 404,
        message: "Blog not found"
      });
      return res.status(response.statusCode).send(response);
    }

    if (updateblog.modifiedCount > 0) {
      let response = success_function({
        statusCode: 200,
        message: "Blog updated successfully"
      });
      return res.status(response.statusCode).send(response);
    } else {
      let response = error_function({
        statusCode: 400,
        message: "No changes made to the blog"
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    let response = error_function({
      statusCode: 400,
      message: error.message ? error.message : error
    });
    return res.status(response.statusCode).send(response);
  }
};



exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.id;

    // Check if the blog exists
    const blogExists = await blogs.exists({ _id: blogId })
    if (!blogExists) {
      let response = error_function({
        statusCode: 404,
        message: "Blog not found",
      });
      return res.status(response.statusCode).send(response);
    }

    // Fetch all comments for the blog and populate the replies
    const allComments = await Comment.find({ blogId })
  .populate({
    path: 'replies', // Populate the replies
    populate: {
      path: 'author',  // Populate author of replies
      select: 'name email',
    },
    options: {
      sort: { createdAt: -1 },  // Sort replies by createdAt (newest first)
    }
  })
  .populate({
    path: 'author', // Populate the main comment's author
    select: 'name email',
  })
  .sort({ createdAt: -1 })  // Sort comments by createdAt (newest first)
  .exec();




    let response = success_function({
      statusCode: 200,
      data: allComments,
    });

    return res.status(response.statusCode).send(response);
  } catch (error) {
    console.error("Error fetching comments:", error);
    let response = error_function({
      statusCode: 400,
      message: error.message || "Internal Server Error",
    });
    return res.status(response.statusCode).send(response);
  }
};



