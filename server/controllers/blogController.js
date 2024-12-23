const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const blogs = require("../db/models/blogs");
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

