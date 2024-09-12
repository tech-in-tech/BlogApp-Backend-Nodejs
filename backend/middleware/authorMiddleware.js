const userModel = require('../models/userModel');
module.exports = async(req,res,next)=>{
  try {
    const user = await userModel.findById(req.body.id)
    if(user.role!=="author"){
      return res.status(401).send({
        success:false,
        message:"Only Author can Access"
      })
    }
    else{
      next()
    }
  } catch (error) {
    console.log("Author Middleware ERROR :: ",error)
    res.status(500).send({
      success:false,
      message:'Error in Author Middelware',
      error
    })
  }
}
