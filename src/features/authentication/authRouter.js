const express = require('express');
const router = express.Router();
const { register, login, logout } = require('./authController');
const { authenticate } = require('../../middleware/authMiddleware');
const { authLimiter } = require('../../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authLimiter, authenticate, logout);

module.exports = router;
