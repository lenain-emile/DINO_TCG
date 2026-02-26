const express = require('express');
const router = express.Router();
const { getProfile, getMyProfile, createProfile, updateProfile } = require('./playerProfileController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.get('/me', apiLimiter, authenticate, getMyProfile);
router.post('/me', apiLimiter, authenticate, createProfile);
router.put('/me', apiLimiter, authenticate, updateProfile);
router.get('/:id', getProfile);

module.exports = router;
