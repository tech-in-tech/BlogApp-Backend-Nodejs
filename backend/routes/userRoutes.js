const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { deleteUserController, getUserController, updateUserController, updateUserPasswordController, resetPasswordController, getAllAuthorsController } = require("../controllers/userController");
const router = express.Router();

// ! Delete user
router.delete('/deleteUser/:id',deleteUserController);
router.get('/getUser',authMiddleware,getUserController);
router.put('/updateUser',authMiddleware,updateUserController);
router.post('/updateUserPassword',authMiddleware,updateUserPasswordController);
router.post('/resetUserPassword',authMiddleware,resetPasswordController);
router.get('/getAllAuthor',getAllAuthorsController);


module.exports = router;