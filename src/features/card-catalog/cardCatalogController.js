const { cards } = require('../../models/cards');

const getAllCards = (req, res) => {
  const { rarity, type, era, search } = req.query;

  let filteredCards = [...cards];

  if (rarity) {
    filteredCards = filteredCards.filter(c => c.rarity.toLowerCase() === rarity.toLowerCase());
  }

  if (type) {
    filteredCards = filteredCards.filter(c => c.type.toLowerCase() === type.toLowerCase());
  }

  if (era) {
    filteredCards = filteredCards.filter(c => c.era && c.era.toLowerCase() === era.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    filteredCards = filteredCards.filter(
      c => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    );
  }

  return res.json({ cards: filteredCards, total: filteredCards.length });
};

const getCardById = (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = cards.find(c => c.id === cardId);

  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  return res.json(card);
};

module.exports = { getAllCards, getCardById };
