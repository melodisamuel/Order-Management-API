const express = require("express");
const authController = require('../Controllers/authController')

const router = express.Router();

router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/profile', authController.getProfile)

module.exports = router;