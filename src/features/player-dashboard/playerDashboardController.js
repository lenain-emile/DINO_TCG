const getDashboard = (req, res) => {
  const playerId = req.user.id;
  const username = req.user.username;

  return res.json({
    playerId,
    username,
    summary: {
      totalCards: 0,
      totalDecks: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      rank: 'Rookie'
    },
    recentActivity: [],
    notifications: []
  });
};

module.exports = { getDashboard };
