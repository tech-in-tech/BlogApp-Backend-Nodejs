const  express = require('express');
const { registerController } = require('../controllers/authController');
const router = express.Router()

// routes
// REGISTER || POST
router.post('/register',registerController)

// LOGIN || POST
router.post('/login')

module.exports = router