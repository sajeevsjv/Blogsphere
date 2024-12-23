const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const blogs = require("../db/models/blogs");
const { response } = require("express");
const fileUpload = require("../utils/file-upload").fileUpload;
const sendEmail = require("../utils/send-email").sendEmail;

exports.loadCategories = async (req,res) =>{
    try{
        let allcategories = await categories.find();
        if(allcategories){
        let response = success_function({
            statusCode : 200,
            data : allcategories
        })
        return res.status(response.statusCode).send(response);
       }

    }
    catch(error){
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error
        })
        return res.status(response.statusCode).send(response);
    }
    
}

exports.addBlog = async (req,res) =>{
    try{
        let data = req.body;
        let title = data.title;
        let content = data.content;
        let category = data.category;
        let image = data.image;

        if(!title || !content || !category){
            let response = error_function({
                statusCode : 400,
                message : "Title, Content and Category are required"
            })
            return res.status(response.statusCode).send(response);
        }
        
        if(image){
            let image = req.body.image;
            //image validation
            let regExp = /^data:/;
            let result = regExp.test(image);
            
    
            if(result){
                let img_path = await fileUpload (image,"users");
                console.log("img_path :",img_path);
                data.image = img_path;
            }
            else{
                let response = error_function({
                    statusCode : 400,
                    message : 'Invalid profile url'
                });
                res.status(response.statusCode).send(response);
                return;
    
            }

            const createblog = await blogs.create(data);
            if(createblog){
                let response = success_function({
                    statusCode : 200,
                    message : "Blog added successfully"
                })
                return res.status(response.statusCode).send(response);
            }
        }

    }
    catch(error){
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error
        })
        return res.status(response.statusCode).send(response);
    }
}

exports.getAllBlogs = async (req,res) =>{
    try{
       const allblogs = await blogs.find();
       let response = success_function({
        statusCode : 200,
        data : allblogs
       })
       return res.status(response.statusCode).send(response);
    }
    catch(error){
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : "an error occured while fetching all blogs"
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
  

