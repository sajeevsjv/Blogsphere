const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController")
const accessControl = require("../utils/access-control").accessControl

function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}


module.exports = router;