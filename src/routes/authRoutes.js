const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/signin
router.post('/signin', authController.signIn);

// POST /api/auth/validate-otp
router.post('/validate-otp', authController.validateOTP);

// POST /api/auth/refreshtoken
router.post('/refreshtoken', authController.refreshToken);

module.exports = router;