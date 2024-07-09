const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.delete('/register', authController.registerUser);

module.exports = router;
