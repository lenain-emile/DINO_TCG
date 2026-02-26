const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable must be set in production');
}

const JWT_SECRET = process.env.JWT_SECRET || 'dino-tcg-dev-secret';
const JWT_EXPIRES_IN = '24h';

const users = [];

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  const existingUser = users.find(u => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
    role: 'player',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, username: user.username, email: user.email, role: user.role }
  });
};

const logout = (req, res) => {
  return res.json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout };
