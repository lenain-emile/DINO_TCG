const express = require('express');
const router = express.Router();
const { getCollection, removeCardFromCollection } = require('./cardCollectionController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.get('/', apiLimiter, authenticate, getCollection);
router.delete('/:cardId', apiLimiter, authenticate, removeCardFromCollection);

module.exports = router;
