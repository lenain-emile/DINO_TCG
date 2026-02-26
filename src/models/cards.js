const cards = [
  {
    id: 1,
    name: 'T-Rex Titan',
    type: 'Creature',
    rarity: 'Legendary',
    attack: 12,
    defense: 8,
    cost: 7,
    description: 'The apex predator of the Cretaceous era. Its roar shakes the very ground.',
    species: 'Tyrannosaurus Rex',
    era: 'Cretaceous',
    imageUrl: '/images/cards/t-rex-titan.png'
  },
  {
    id: 2,
    name: 'Velociraptor Scout',
    type: 'Creature',
    rarity: 'Rare',
    attack: 5,
    defense: 3,
    cost: 2,
    description: 'Quick and cunning, it strikes before the enemy can react.',
    species: 'Velociraptor',
    era: 'Cretaceous',
    imageUrl: '/images/cards/velociraptor-scout.png'
  },
  {
    id: 3,
    name: 'Triceratops Shield',
    type: 'Creature',
    rarity: 'Uncommon',
    attack: 3,
    defense: 10,
    cost: 4,
    description: 'A living fortress with three horns and an iron will.',
    species: 'Triceratops',
    era: 'Cretaceous',
    imageUrl: '/images/cards/triceratops-shield.png'
  },
  {
    id: 4,
    name: 'Pterodactyl Strike',
    type: 'Spell',
    rarity: 'Common',
    attack: 4,
    defense: 0,
    cost: 2,
    description: 'Unleash a rain of aerial attacks from above.',
    species: null,
    era: 'Jurassic',
    imageUrl: '/images/cards/pterodactyl-strike.png'
  },
  {
    id: 5,
    name: 'Brachiosaurus Guardian',
    type: 'Creature',
    rarity: 'Epic',
    attack: 6,
    defense: 14,
    cost: 6,
    description: 'Towers above all others, protecting allies with its massive neck.',
    species: 'Brachiosaurus',
    era: 'Jurassic',
    imageUrl: '/images/cards/brachiosaurus-guardian.png'
  }
];

module.exports = { cards };
