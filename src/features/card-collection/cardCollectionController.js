const { cards } = require('../../models/cards');

const collections = [];

const getCollection = (req, res) => {
  const playerId = req.user.id;
  const collection = collections.find(c => c.playerId === playerId);

  if (!collection) {
    return res.json({ playerId, cards: [], total: 0 });
  }

  const enrichedCards = collection.cards.map(entry => {
    const card = cards.find(c => c.id === entry.cardId);
    return { ...card, quantity: entry.quantity, obtainedAt: entry.obtainedAt };
  });

  return res.json({ playerId, cards: enrichedCards, total: enrichedCards.length });
};

const addCardToCollection = (playerId, cardId, quantity = 1) => {
  let collection = collections.find(c => c.playerId === playerId);

  if (!collection) {
    collection = { playerId, cards: [] };
    collections.push(collection);
  }

  const existing = collection.cards.find(entry => entry.cardId === cardId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    collection.cards.push({
      cardId,
      quantity,
      obtainedAt: new Date().toISOString()
    });
  }
};

const removeCardFromCollection = (req, res) => {
  const playerId = req.user.id;
  const cardId = parseInt(req.params.cardId);
  const { quantity = 1 } = req.body;

  const collection = collections.find(c => c.playerId === playerId);
  if (!collection) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  const cardIndex = collection.cards.findIndex(entry => entry.cardId === cardId);
  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Card not found in collection' });
  }

  collection.cards[cardIndex].quantity -= quantity;
  if (collection.cards[cardIndex].quantity <= 0) {
    collection.cards.splice(cardIndex, 1);
  }

  return res.json({ message: 'Card removed from collection' });
};

module.exports = { getCollection, addCardToCollection, removeCardFromCollection };
