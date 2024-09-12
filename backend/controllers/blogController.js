const blogModel = require("../models/blogModel")
const cloudinary = require("cloudinary");
const blogPostController = async (req, res) => {
  try {
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
    
    const createdBy = req.user._id;
    const authorName = req.user.name;
    const authorAvatar = req.user.avatar.url;

    
  if (!title || !category || !intro) {
    return res.status(400).send({
      success:false,
      message:"Title, Intto, Catagory are required field"
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
      success:false,
      message:"Error occured while uploading one or more images!"
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

module.exports = { blogPostController }