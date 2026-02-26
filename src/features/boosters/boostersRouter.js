const express = require('express');
const router = express.Router();
const { getBoosterTypes, openBooster } = require('./boostersController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.get('/types', getBoosterTypes);
router.post('/open', apiLimiter, authenticate, openBooster);

module.exports = router;
