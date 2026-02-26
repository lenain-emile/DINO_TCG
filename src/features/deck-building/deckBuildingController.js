const { cards } = require('../../models/cards');
const { v4: uuidv4 } = require('uuid');

const decks = [];
const DECK_MAX_CARDS = 20;
const DECK_MIN_CARDS = 10;

const getDecks = (req, res) => {
  const playerId = req.user.id;
  const playerDecks = decks.filter(d => d.playerId === playerId);
  return res.json(playerDecks);
};

const getDeckById = (req, res) => {
  const deckId = req.params.id;
  const playerId = req.user.id;
  const deck = decks.find(d => d.id === deckId && d.playerId === playerId);

  if (!deck) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  const enrichedCards = deck.cards.map(entry => {
    const card = cards.find(c => c.id === entry.cardId);
    return { ...card, quantity: entry.quantity };
  });

  return res.json({ ...deck, cards: enrichedCards });
};

const createDeck = (req, res) => {
  const playerId = req.user.id;
  const { name, description, cardList } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Deck name is required' });
  }

  if (cardList) {
    const totalCards = cardList.reduce((sum, entry) => sum + entry.quantity, 0);
    if (totalCards > DECK_MAX_CARDS) {
      return res.status(400).json({ error: `Deck cannot exceed ${DECK_MAX_CARDS} cards` });
    }

    const invalidCards = cardList.filter(entry => !cards.find(c => c.id === entry.cardId));
    if (invalidCards.length > 0) {
      return res.status(400).json({ error: 'One or more card IDs are invalid' });
    }
  }

  const newDeck = {
    id: uuidv4(),
    playerId,
    name,
    description: description || '',
    cards: cardList || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  decks.push(newDeck);
  return res.status(201).json(newDeck);
};

const updateDeck = (req, res) => {
  const deckId = req.params.id;
  const playerId = req.user.id;
  const { name, description, cardList } = req.body;

  const deckIndex = decks.findIndex(d => d.id === deckId && d.playerId === playerId);
  if (deckIndex === -1) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  if (cardList) {
    const totalCards = cardList.reduce((sum, entry) => sum + entry.quantity, 0);
    if (totalCards > DECK_MAX_CARDS) {
      return res.status(400).json({ error: `Deck cannot exceed ${DECK_MAX_CARDS} cards` });
    }
  }

  decks[deckIndex] = {
    ...decks[deckIndex],
    name: name !== undefined ? name : decks[deckIndex].name,
    description: description !== undefined ? description : decks[deckIndex].description,
    cards: cardList !== undefined ? cardList : decks[deckIndex].cards,
    updatedAt: new Date().toISOString()
  };

  return res.json(decks[deckIndex]);
};

const deleteDeck = (req, res) => {
  const deckId = req.params.id;
  const playerId = req.user.id;

  const deckIndex = decks.findIndex(d => d.id === deckId && d.playerId === playerId);
  if (deckIndex === -1) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  decks.splice(deckIndex, 1);
  return res.json({ message: 'Deck deleted successfully' });
};

const validateDeck = (req, res) => {
  const deckId = req.params.id;
  const playerId = req.user.id;

  const deck = decks.find(d => d.id === deckId && d.playerId === playerId);
  if (!deck) {
    return res.status(404).json({ error: 'Deck not found' });
  }

  const totalCards = deck.cards.reduce((sum, entry) => sum + entry.quantity, 0);
  const isValid = totalCards >= DECK_MIN_CARDS && totalCards <= DECK_MAX_CARDS;

  return res.json({
    isValid,
    totalCards,
    minCards: DECK_MIN_CARDS,
    maxCards: DECK_MAX_CARDS,
    message: isValid ? 'Deck is valid and ready to play!' : `Deck must contain between ${DECK_MIN_CARDS} and ${DECK_MAX_CARDS} cards`
  });
};

module.exports = { getDecks, getDeckById, createDeck, updateDeck, deleteDeck, validateDeck };
