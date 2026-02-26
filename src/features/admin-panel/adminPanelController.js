const { cards } = require('../../models/cards');
const { v4: uuidv4 } = require('uuid');

const getAdminStats = (req, res) => {
  return res.json({
    totalCards: cards.length,
    totalPlayers: 0,
    totalDecks: 0,
    totalBoostersOpened: 0
  });
};

const getAllPlayers = (req, res) => {
  return res.json({ players: [], total: 0 });
};

const banPlayer = (req, res) => {
  const playerId = parseInt(req.params.id);
  return res.json({ message: `Player ${playerId} has been banned` });
};

const unbanPlayer = (req, res) => {
  const playerId = parseInt(req.params.id);
  return res.json({ message: `Player ${playerId} has been unbanned` });
};

const addCard = (req, res) => {
  const { name, type, rarity, attack, defense, cost, description, species, era } = req.body;

  if (!name || !type || !rarity) {
    return res.status(400).json({ error: 'Name, type, and rarity are required' });
  }

  const newCard = {
    id: uuidv4(),
    name,
    type,
    rarity,
    attack: attack || 0,
    defense: defense || 0,
    cost: cost || 0,
    description: description || '',
    species: species || null,
    era: era || null,
    imageUrl: `/images/cards/${name.toLowerCase().replace(/\s+/g, '-')}.png`
  };

  cards.push(newCard);
  return res.status(201).json(newCard);
};

module.exports = { getAdminStats, getAllPlayers, banPlayer, unbanPlayer, addCard };
