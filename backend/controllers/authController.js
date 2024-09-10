const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, phone, education, role, password,uniqueNum } = req.body;
    // validation
    if (!name) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your name"
      })
    }
    if (!uniqueNum) {
      return res.status(500).send({
        success: false,
        message: "Please Provide uniqueNum"
      })
    }
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your email"
      })
    }
    if (!phone) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your contact Number"
      })
    }
    if (!education) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your Education details"
      })
    }
    if (!role) {
      return res.status(500).send({
        success: false,
        message: "Please provide your role [Reader, Author]"
      })
    }
    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Password"
      })
    }
    // Check User
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "Email Already REgistered please Login"
      })
    }
    // Hashing Password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // creating new User
    const user = await userModel.create({ name, email, phone, education, role, password: hashedPassword,uniqueNum })
    res.status(201).send({
      success: true,
      message: "Successfully Register",
      user: user
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registor API | registerController",
      Error: error
    })
  }
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Email"
      })
    }
    if (!password) {
      return res.status(500).send({
        success: false,
        message: "Please Provide Password "
      })
    }
    // Check User
    const user = await userModel.findOne({ email });
    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found"
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // Generate token
    const token = JWT.sign({ id: user._id },
      process.env.JWT_SECRET, {
      expiresIn: "10D"
    }
    )
    res.status(200).send({
      success: true,
      message: "Login successfully",
      token,
      user,
    })
  } catch (error) {
    console.log("LoginController :: ", error);
    res.status(500).send({
      success: false,
      message: 'Error in Login API',
      error
    })
  }
}
module.exports = { registerController,loginController }