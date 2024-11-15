const express = require("express");
const authController = require('../Controllers/authController')

const router = express.Router();

router.post('/register', authController.register)

module.exports = router;