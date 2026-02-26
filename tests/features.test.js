const request = require('supertest');
const app = require('../src/index');

describe('Authentication Feature', () => {
  test('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testplayer',
      email: 'test@dinotcg.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe('testplayer');
  });

  test('POST /api/auth/login - should login an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'logintest',
      email: 'login@dinotcg.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@dinotcg.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@dinotcg.com',
      password: 'wrongpassword'
    });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/register - should reject missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'incomplete'
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Card Catalog Feature', () => {
  test('GET /api/cards - should return all cards', async () => {
    const res = await request(app).get('/api/cards');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('cards');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.cards)).toBe(true);
  });

  test('GET /api/cards/:id - should return a specific card', async () => {
    const res = await request(app).get('/api/cards/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('rarity');
  });

  test('GET /api/cards/:id - should return 404 for unknown card', async () => {
    const res = await request(app).get('/api/cards/9999');
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/cards?rarity=Legendary - should filter by rarity', async () => {
    const res = await request(app).get('/api/cards?rarity=Legendary');
    expect(res.statusCode).toBe(200);
    res.body.cards.forEach(card => {
      expect(card.rarity).toBe('Legendary');
    });
  });
});

describe('Booster Types Feature', () => {
  test('GET /api/boosters/types - should return available booster types', async () => {
    const res = await request(app).get('/api/boosters/types');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('Statistics Feature', () => {
  test('GET /api/statistics - should return global statistics', async () => {
    const res = await request(app).get('/api/statistics');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('global');
    expect(res.body).toHaveProperty('cardsByRarity');
  });

  test('GET /api/statistics/leaderboard - should return leaderboard', async () => {
    const res = await request(app).get('/api/statistics/leaderboard');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('leaderboard');
  });
});

describe('Protected Routes', () => {
  test('GET /api/collection - should require authentication', async () => {
    const res = await request(app).get('/api/collection');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/decks - should require authentication', async () => {
    const res = await request(app).get('/api/decks');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/dashboard - should require authentication', async () => {
    const res = await request(app).get('/api/dashboard');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/admin/stats - should require admin role', async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      username: 'normaluser',
      email: 'normal@dinotcg.com',
      password: 'password123'
    });
    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});
