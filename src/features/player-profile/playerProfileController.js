const profiles = [];

const getProfile = (req, res) => {
  const playerId = parseInt(req.params.id);
  const profile = profiles.find(p => p.playerId === playerId);

  if (!profile) {
    return res.status(404).json({ error: 'Player profile not found' });
  }

  return res.json(profile);
};

const getMyProfile = (req, res) => {
  const playerId = req.user.id;
  const profile = profiles.find(p => p.playerId === playerId);

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found. Please create your profile.' });
  }

  return res.json(profile);
};

const createProfile = (req, res) => {
  const playerId = req.user.id;
  const { avatar, bio, favoriteCard } = req.body;

  const existing = profiles.find(p => p.playerId === playerId);
  if (existing) {
    return res.status(409).json({ error: 'Profile already exists' });
  }

  const newProfile = {
    playerId,
    username: req.user.username,
    avatar: avatar || 'default-avatar',
    bio: bio || '',
    favoriteCard: favoriteCard || null,
    wins: 0,
    losses: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  profiles.push(newProfile);
  return res.status(201).json(newProfile);
};

const updateProfile = (req, res) => {
  const playerId = req.user.id;
  const { avatar, bio, favoriteCard } = req.body;

  const profileIndex = profiles.findIndex(p => p.playerId === playerId);
  if (profileIndex === -1) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  profiles[profileIndex] = {
    ...profiles[profileIndex],
    avatar: avatar !== undefined ? avatar : profiles[profileIndex].avatar,
    bio: bio !== undefined ? bio : profiles[profileIndex].bio,
    favoriteCard: favoriteCard !== undefined ? favoriteCard : profiles[profileIndex].favoriteCard,
    updatedAt: new Date().toISOString()
  };

  return res.json(profiles[profileIndex]);
};

module.exports = { getProfile, getMyProfile, createProfile, updateProfile };
