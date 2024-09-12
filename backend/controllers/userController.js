const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs')

// ! Get User Controller
// Only for login user
const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id })  // {_id:0} to hide the field
    // validation
    // console.log(req.body.id)
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found"
      })
    }

    // res send
    res.status(200).send({
      success: true,
      message: "User get Successfully",
      user
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in get user API",
      error
    })
  }
}

// !update user
const updateUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id })
    // validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      })
    }
    // update
    const { name, phone, avatar } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Updated Successfully",
      user
    })

  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in update user API",
      error
    })
  }
}


// Update user password 
const updateUserPasswordController  = async(req,res)=>{
  try {
    // find user
    const user = await userModel.findById({_id:req.body.id})
    // validation
    if (!user) {
      return res.status(404).send({
        seccess: false,
        message: 'User Not Found'
      })
    }
    // get data from user
    const { oldPassword, newPassword } = req.body
    if (!oldPassword) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide Old Password'
      })
    }
    if (!newPassword) {
      return res.status(500).send({
        success: false,
        message: 'Please Provide New Password'
      })
    }
    // compare user old password
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid old Password",
      });
    }
    // Hashing Password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword,salt)

    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success:true,
      message:"Password Update"
    })


  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error in Password Update API',
      error
    })
  }
}


// ! delete User Controller 
const deleteUserController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id)
    return res.status(200).send({
      success: true,
      message: 'Your account has been deleted',
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({

      success: false,
      message: "error in DELETE profile API",
      error
    })
  }
}

// RESET PASSWORD 
const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, uniqueNum } = req.body;
    if (!email || !newPassword || !uniqueNum) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Field"
      })
    }
    const user = await userModel.findOne({ email, uniqueNum })
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User Not Found or Invalid uniqueNum"
      })
    }
    // Hashing password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "password Reset Successfully"
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in PASSWORD RESET API",
      error
    })
  }
}


// get all author
const getAllAuthorsController = async(req,res)=>{
  try {
    const authors = await userModel.find({role:"author"});
    if(authors.length === 0){
      return res.status(404).send({
        success: false,
        message: "There is no Author"
      })
    }
    // res send
    res.status(200).send({
      success: true,
      message: "authors get successfully",
      authors
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Error in get all authors API",
      error
    })
  }
}

module.exports = { deleteUserController, getUserController, updateUserController,updateUserPasswordController,resetPasswordController,getAllAuthorsController }