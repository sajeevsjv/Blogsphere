const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController")
const accessControl = require("../utils/access-control").accessControl

function setaccessControl(access_types){
    return (req,res,next) =>{
        accessControl( access_types, req, res, next);
    }
}

router.get("/categories",setaccessControl("1,2"),blogController.loadCategories);
router.post("/addblog",setaccessControl("1,2"),blogController.addBlog);
router.get("/getallblogs",blogController.getAllBlogs);
router.get("/getsingleblog/:id",blogController.getSingleBlog);
router.get("/myblogs/:id",setaccessControl("1,2"),blogController.myblogs);
router.delete("/deleteblog/:id",setaccessControl("1,2"),blogController.deleteBlog);
router.put("/updateblog/:id",setaccessControl("1,2"),blogController.updateBlog);
router.get("/comments/:id",blogController.getComments);


module.exports = router;