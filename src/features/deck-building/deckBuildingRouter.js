const express = require('express');
const router = express.Router();
const { getDecks, getDeckById, createDeck, updateDeck, deleteDeck, validateDeck } = require('./deckBuildingController');
const { authenticate } = require('../../middleware/authMiddleware');
const { apiLimiter } = require('../../middleware/rateLimiter');

router.use(apiLimiter, authenticate);

router.get('/', getDecks);
router.get('/:id', getDeckById);
router.post('/', createDeck);
router.put('/:id', updateDeck);
router.delete('/:id', deleteDeck);
router.get('/:id/validate', validateDeck);

module.exports = router;
