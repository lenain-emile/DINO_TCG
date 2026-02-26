const express = require('express');
const router = express.Router();
const { getGlobalStatistics, getPlayerStatistics, getLeaderboard } = require('./statisticsController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.get('/', getGlobalStatistics);
router.get('/me', apiLimiter, authenticate, getPlayerStatistics);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
