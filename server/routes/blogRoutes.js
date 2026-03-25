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
router.post("/blogs", setaccessControl("1,2"), blogController.createBlog);
router.get("/blogs", setaccessControl("*"), blogController.getAllBlogs);
router.get("/blogs/:blogId", setaccessControl("*"), blogController.getSingleBlog);
router.post("/blogs/:blogId/comments", setaccessControl("*"), blogController.addComment);
router.post("/blogs/:blogId/comments/:commentId/replies", setaccessControl("*"), blogController.addReply);
router.post("/blogs/:blogId/like", setaccessControl("1,2"), blogController.toggleLike);


module.exports = router;