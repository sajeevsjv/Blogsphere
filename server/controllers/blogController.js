const mongoose = require("mongoose");
const { error_function, success_function } = require("../utils/response-handler");
const users = require("../db/models/users");
const categories = require("../db/models/categories");
const categories = require("../db/models/categories");
const fileUpload = require("../utils/file-upload").fileUpload;
const sendEmail = require("../utils/send-email").sendEmail;

exports.loadCategories = async (req,res) =>{
    try{
        let categories = await categories.find();
        let response = success_function({
            statusCode : 400,
            data : categories
        })
        return res.status(response.statusCode).send(response);

    }
    catch(error){
        let response = error_function({
            statusCode : 400,
            message : error.message ? error.message : error
        })
        return res.status(response.statusCode).send(response);
    }
    
}


