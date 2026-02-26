const express = require('express');
const router = express.Router();
const { getAdminStats, getAllPlayers, banPlayer, unbanPlayer, addCard } = require('./adminPanelController');
const { authenticate, requireAdmin } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.use(apiLimiter, authenticate, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/players', getAllPlayers);
router.post('/players/:id/ban', banPlayer);
router.post('/players/:id/unban', unbanPlayer);
router.post('/cards', addCard);

module.exports = router;
