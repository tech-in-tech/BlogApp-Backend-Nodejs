const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { deleteUserController } = require("../controllers/userController");
const router = express.Router();

// ! Delete user
router.delete('/deleteUser/:id',deleteUserController);


module.exports = router;