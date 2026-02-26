const { cards } = require('../../models/cards');

const getGlobalStatistics = (req, res) => {
  const cardsByRarity = cards.reduce((acc, card) => {
    acc[card.rarity] = (acc[card.rarity] || 0) + 1;
    return acc;
  }, {});

  const cardsByType = cards.reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
  }, {});

  return res.json({
    global: {
      totalCards: cards.length,
      totalPlayers: 0,
      totalDecks: 0,
      totalGames: 0
    },
    cardsByRarity,
    cardsByType,
    leaderboard: []
  });
};

const getPlayerStatistics = (req, res) => {
  const playerId = req.user.id;

  return res.json({
    playerId,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalGames: 0,
    longestWinStreak: 0,
    favoriteCard: null,
    mostUsedDeck: null
  });
};

const getLeaderboard = (req, res) => {
  return res.json({ leaderboard: [], total: 0 });
};

module.exports = { getGlobalStatistics, getPlayerStatistics, getLeaderboard };
