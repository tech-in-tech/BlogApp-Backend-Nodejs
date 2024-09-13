const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorMiddleware = require("../middleware/authorMiddleware");
const { blogPostController, deleteBlogController, getAllBlogsController, getSingleBlogController, getMyBlogController } = require("../controllers/blogController");
const router = express.Router();

router.post('/PostBlog',authMiddleware,authorMiddleware,blogPostController);

router.delete('/deleteBlog/:id',authMiddleware,authorMiddleware,deleteBlogController);

router.get('/getAllBlog',authMiddleware,getAllBlogsController);

router.get('/getSingleBlog/:id',authMiddleware,getSingleBlogController);

router.get('/getMyBlog',authMiddleware,authorMiddleware,getMyBlogController);


module.exports = router;