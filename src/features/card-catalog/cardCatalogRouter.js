const express = require('express');
const router = express.Router();
const { getAllCards, getCardById } = require('./cardCatalogController');

router.get('/', getAllCards);
router.get('/:id', getCardById);

module.exports = router;
