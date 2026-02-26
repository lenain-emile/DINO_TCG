const { cards } = require('../../models/cards');
const { addCardToCollection } = require('../card-collection/cardCollectionController');

const BOOSTER_TYPES = {
  standard: { name: 'Standard Pack', cardCount: 5, price: 100, rarityWeights: { Common: 0.60, Uncommon: 0.25, Rare: 0.10, Epic: 0.04, Legendary: 0.01 } },
  premium: { name: 'Premium Pack', cardCount: 5, price: 250, rarityWeights: { Common: 0.30, Uncommon: 0.35, Rare: 0.20, Epic: 0.10, Legendary: 0.05 } }
};

const pickCardByRarity = (rarityWeights) => {
  const rand = Math.random();
  let cumulative = 0;

  for (const [rarity, weight] of Object.entries(rarityWeights)) {
    cumulative += weight;
    if (rand <= cumulative) {
      const rarityCards = cards.filter(c => c.rarity === rarity);
      if (rarityCards.length > 0) {
        return rarityCards[Math.floor(Math.random() * rarityCards.length)];
      }
    }
  }

  return cards[Math.floor(Math.random() * cards.length)];
};

const getBoosterTypes = (req, res) => {
  const types = Object.entries(BOOSTER_TYPES).map(([key, value]) => ({
    id: key,
    ...value
  }));
  return res.json(types);
};

const openBooster = (req, res) => {
  const { type = 'standard' } = req.body;
  const playerId = req.user.id;

  const boosterType = BOOSTER_TYPES[type];
  if (!boosterType) {
    return res.status(400).json({ error: 'Invalid booster type' });
  }

  const drawnCards = [];
  for (let i = 0; i < boosterType.cardCount; i++) {
    const card = pickCardByRarity(boosterType.rarityWeights);
    drawnCards.push(card);
    addCardToCollection(playerId, card.id, 1);
  }

  return res.status(201).json({
    message: `${boosterType.name} opened!`,
    cards: drawnCards
  });
};

module.exports = { getBoosterTypes, openBooster };
