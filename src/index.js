const express = require('express');
const app = express();

const authRouter = require('./features/authentication/authRouter');
const playerProfileRouter = require('./features/player-profile/playerProfileRouter');
const cardCatalogRouter = require('./features/card-catalog/cardCatalogRouter');
const cardCollectionRouter = require('./features/card-collection/cardCollectionRouter');
const boostersRouter = require('./features/boosters/boostersRouter');
const deckBuildingRouter = require('./features/deck-building/deckBuildingRouter');
const playerDashboardRouter = require('./features/player-dashboard/playerDashboardRouter');
const adminPanelRouter = require('./features/admin-panel/adminPanelRouter');
const statisticsRouter = require('./features/statistics/statisticsRouter');

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/players', playerProfileRouter);
app.use('/api/cards', cardCatalogRouter);
app.use('/api/collection', cardCollectionRouter);
app.use('/api/boosters', boostersRouter);
app.use('/api/decks', deckBuildingRouter);
app.use('/api/dashboard', playerDashboardRouter);
app.use('/api/admin', adminPanelRouter);
app.use('/api/statistics', statisticsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DINO TCG API', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DINO TCG server running on port ${PORT}`);
  });
}

module.exports = app;
