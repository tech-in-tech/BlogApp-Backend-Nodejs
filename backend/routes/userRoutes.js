const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { deleteUserController, getUserController, updateUserController, updateUserPasswordController, resetPasswordController, getAllAuthorsController } = require("../controllers/userController");
const router = express.Router();

// * Delete user | DELETE
router.delete('/deleteUser/:id',deleteUserController);
// * get user | GET
router.get('/getUser',authMiddleware,getUserController);
// * Update user | PUT
router.put('/updateUser',authMiddleware,updateUserController);
// * Update user password | POST
router.post('/updateUserPassword',authMiddleware,updateUserPasswordController);
// * Reset user password | POST
router.post('/resetUserPassword',authMiddleware,resetPasswordController);
// * Get all authors | GET
router.get('/getAllAuthor',getAllAuthorsController);


module.exports = router;