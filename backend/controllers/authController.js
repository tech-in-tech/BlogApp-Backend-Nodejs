const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

// Register
const registerController = async (req, res) => {
  try {
    const { name, email, phone, education, role, password } = req.body;
    // validation
    if (!name) {
      return res.status(500).send({
        success: false,
        message: "Please Provide your name"
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
    const existingUser = await userModel.findOne({email});
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
    const user = await userModel.create({name,email,phone,education,role,password:hashedPassword})
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

module.exports = { registerController }