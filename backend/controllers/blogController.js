const blogModel = require("../models/blogModel")
const cloudinary = require("cloudinary");
const userModel = require('../models/userModel')
const blogPostController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.id })
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({
        success: false,
        message: "Blog main image is required",
      })
    }
    const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
    if (!mainImage) {
      return res.status(400).send({
        success: false,
        message: "Blog main image is required"
      })
    }
    const allowedFormates = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedFormates.includes(mainImage.mimetype) ||
      (paraOneImage && !allowedFormates.includes(paraOneImage.mimetype)) ||
      (paraTwoImage && !allowedFormates.includes(paraTwoImage.mimetype)) ||
      (paraThreeImage && !allowedFormates.includes(paraThreeImage.mimetype))) {
      return res.status(400).send({
        success: false,
        message: "Invalid file type. Only JPG,PNG,WEBP are allowed",
        error
      })
    }
    const {
      title,
      intro,
      paraOneDescription,
      paraOneTitle,
      paraTwoDescription,
      paraTwoTitle,
      paraThreeDescription,
      paraThreeTitle,
      category,
      published
    } = req.body

    const createdBy = user.id;
    const authorName = user.name;
    const authorAvatar = user.avatar.url;


    if (!title || !category || !intro) {
      return res.status(400).send({
        success: false,
        message: "Title, Intto, Catagory are required field"
      })
    }
    const uploadPromises = [
      cloudinary.uploader.upload(mainImage.tempFilePath),
      paraOneImage
        ? cloudinary.uploader.upload(paraOneImage.tempFilePath)
        : Promise.resolve(null),
      paraTwoImage
        ? cloudinary.uploader.upload(paraTwoImage.tempFilePath)
        : Promise.resolve(null),
      paraThreeImage
        ? cloudinary.uploader.upload(paraThreeImage.tempFilePath)
        : Promise.resolve(null),
    ];
    const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] =
      await Promise.all(uploadPromises);
    if (
      !mainImageRes ||
      mainImageRes.error ||
      (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
      (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) ||
      (paraThreeImage && (!paraThreeImageRes || paraThreeImageRes.error))
    ) {
      return res.status(500).send({
        success: false,
        message: "Error occured while uploading one or more images!"
      })
    }
    const blogData = {
      title,
      intro,
      paraOneDescription,
      paraOneTitle,
      paraTwoDescription,
      paraTwoTitle,
      paraThreeDescription,
      paraThreeTitle,
      category,
      createdBy,
      authorAvatar,
      authorName,
      published,
      mainImage: {
        public_id: mainImageRes.public_id,
        url: mainImageRes.secure_url,
      },
    };
    if (paraOneImageRes) {
      blogData.paraOneImage = {
        public_id: paraOneImageRes.public_id,
        url: paraOneImageRes.secure_url,
      };
    }
    if (paraTwoImageRes) {
      blogData.paraTwoImage = {
        public_id: paraTwoImageRes.public_id,
        url: paraTwoImageRes.secure_url,
      };
    }
    if (paraThreeImageRes) {
      blogData.paraThreeImage = {
        public_id: paraThreeImageRes.public_id,
        url: paraThreeImageRes.secure_url,
      };
    }
    const blog = await blogModel.create(blogData);
    res.status(200).json({
      success: true,
      message: "Blog Uploaded!",
      blog,
    });

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in Post Blog API",
      error
    })
  }
}


const deleteBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog Not Fiend"
      })
    }
    await blog.deleteOne();
    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully !",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in delete Blog API"
    })
  }
}


const getAllBlogsController = async (req, res) => {
  try {
    const allBlogs = await blogModel.find({ published: true })
    if (allBlogs.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Published Blog Found"
      })
    }

    res.status(200).send({
      success: true,
      allBlogs
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get All Blog API"
    })
  }
}


const getSingleBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog Not Found"
      })
    }
    res.status(200).send({
      success: true,
      blog
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get Single Blog API"
    })
  }
}

const getMyBlogController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.id })
    const createdBy = user.id;
    const blog = await blogModel.find({ createdBy })
    if(!blog){
      return res.status(404).send({
        success:false,
        message:"Blog Not Found"
      })
    }
    res.status(200).send({
      success: true,
      blog
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Get My Blog API"
    })
  }
}


const updateBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    let blog = await blogModel.findById(blogId);

    // Check if blog exists
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog Not Found",
      });
    }

    // Prepare new blog data
    const newBlogData = {
      title: req.body.title,
      intro: req.body.intro,
      category: req.body.category,
      paraOneTitle: req.body.paraOneTitle,
      paraOneDescription: req.body.paraOneDescription,
      paraTwoTitle: req.body.paraTwoTitle,
      paraTwoDescription: req.body.paraTwoDescription,
      paraThreeTitle: req.body.paraThreeTitle,
      paraThreeDescription: req.body.paraThreeDescription,
      published: req.body.published,
    };

    // Handle file uploads if present
    if (req.files) {
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

      if (req.files.mainImage && !allowedFormats.includes(req.files.mainImage.mimetype)) {
        return res.status(400).send({
          success: false,
          message: "Invalid image format for main image",
        });
      }
      if (req.files.paraOneImage && !allowedFormats.includes(req.files.paraOneImage.mimetype)) {
        return res.status(400).send({
          success: false,
          message: "Invalid image format for paragraph one image",
        });
      }
      if (req.files.paraTwoImage && !allowedFormats.includes(req.files.paraTwoImage.mimetype)) {
        return res.status(400).send({
          success: false,
          message: "Invalid image format for paragraph two image",
        });
      }
      if (req.files.paraThreeImage && !allowedFormats.includes(req.files.paraThreeImage.mimetype)) {
        return res.status(400).send({
          success: false,
          message: "Invalid image format for paragraph three image",
        });
      }

      // Main image
      if (req.files.mainImage) {
        const blogMainImageId = blog.mainImage.public_id;
        await cloudinary.uploader.destroy(blogMainImageId);
        const newBlogMainImage = await cloudinary.uploader.upload(req.files.mainImage.tempFilePath);
        newBlogData.mainImage = {
          public_id: newBlogMainImage.public_id,
          url: newBlogMainImage.secure_url,
        };
      }

      // Paragraph One image
      if (req.files.paraOneImage) {
        if (blog.paraOneImage && blog.paraOneImage.public_id) {
          await cloudinary.uploader.destroy(blog.paraOneImage.public_id);
        }
        const newBlogParaOneImage = await cloudinary.uploader.upload(req.files.paraOneImage.tempFilePath);
        newBlogData.paraOneImage = {
          public_id: newBlogParaOneImage.public_id,
          url: newBlogParaOneImage.secure_url,
        };
      }

      // Paragraph Two image
      if (req.files.paraTwoImage) {
        if (blog.paraTwoImage && blog.paraTwoImage.public_id) {
          await cloudinary.uploader.destroy(blog.paraTwoImage.public_id);
        }
        const newBlogParaTwoImage = await cloudinary.uploader.upload(req.files.paraTwoImage.tempFilePath);
        newBlogData.paraTwoImage = {
          public_id: newBlogParaTwoImage.public_id,
          url: newBlogParaTwoImage.secure_url,
        };
      }

      // Paragraph Three image
      if (req.files.paraThreeImage) {
        if (blog.paraThreeImage && blog.paraThreeImage.public_id) {
          await cloudinary.uploader.destroy(blog.paraThreeImage.public_id);
        }
        const newBlogParaThreeImage = await cloudinary.uploader.upload(req.files.paraThreeImage.tempFilePath);
        newBlogData.paraThreeImage = {
          public_id: newBlogParaThreeImage.public_id,
          url: newBlogParaThreeImage.secure_url,
        };
      }
    }

    // Update the blog
    blog = await blogModel.findByIdAndUpdate(blogId, newBlogData, {
      new: true,
      runValidators: true,
    });

    // Send response after successful update
    return res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Update Blog API",
    });
  }
};

module.exports = {
  blogPostController,
  deleteBlogController,
  getAllBlogsController,
  getSingleBlogController,
  getMyBlogController,
  updateBlogController
}