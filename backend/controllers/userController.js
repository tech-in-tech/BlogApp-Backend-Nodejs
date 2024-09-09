const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs')

const deleteUserController = async(req,res)=>{
  try {
    await userModel.findByIdAndDelete(req.params.id)
    return res.status(200).send({
      success:true,
      message:'Your account has been deleted',
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

module.exports = {deleteUserController}