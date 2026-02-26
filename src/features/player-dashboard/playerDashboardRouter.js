const express = require('express');
const router = express.Router();
const { getDashboard } = require('./playerDashboardController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.get('/', apiLimiter, authenticate, getDashboard);

module.exports = router;
