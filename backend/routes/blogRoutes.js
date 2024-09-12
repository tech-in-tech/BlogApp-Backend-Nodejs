const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const authorMiddleware = require("../middleware/authorMiddleware");
const { blogPostController } = require("../controllers/blogController");
const router = express.Router();

router.post('/PostBlog',authMiddleware,authorMiddleware,blogPostController);


module.exports = router;