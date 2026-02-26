# DINO TCG

A dinosaur-themed Trading Card Game web application built with Node.js and Express.

## Features

The application is organized into the following feature modules:

| Feature | Branch | Description |
|---|---|---|
| Authentication | `feature/authentication` | User registration, login, and JWT-based auth |
| Player Profile | `feature/player-profile` | Player profile management and customization |
| Card Catalog | `feature/card-catalog` | Browse and search the full card catalog |
| Card Collection | `feature/card-collection` | Manage your personal card collection |
| Boosters | `feature/boosters` | Open booster packs to get new cards |
| Deck Building | `feature/deck-building` | Create and manage decks for battles |
| Player Dashboard | `feature/player-dashboard` | Main hub with stats and recent activity |
| Admin Panel | `feature/admin-panel` | Admin tools for managing players and cards |
| Statistics | `feature/statistics` | Global and personal game statistics |

## Getting Started

```bash
npm install
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new account |
| POST | `/api/auth/login` | No | Login and receive a JWT token |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/players/me` | Yes | Get own profile |
| POST | `/api/players/me` | Yes | Create profile |
| PUT | `/api/players/me` | Yes | Update profile |
| GET | `/api/players/:id` | No | Get a player's public profile |
| GET | `/api/cards` | No | List all cards (supports filters) |
| GET | `/api/cards/:id` | No | Get a specific card |
| GET | `/api/collection` | Yes | Get own card collection |
| DELETE | `/api/collection/:cardId` | Yes | Remove a card from collection |
| GET | `/api/boosters/types` | No | List available booster types |
| POST | `/api/boosters/open` | Yes | Open a booster pack |
| GET | `/api/decks` | Yes | List own decks |
| POST | `/api/decks` | Yes | Create a new deck |
| GET | `/api/decks/:id` | Yes | Get a specific deck |
| PUT | `/api/decks/:id` | Yes | Update a deck |
| DELETE | `/api/decks/:id` | Yes | Delete a deck |
| GET | `/api/decks/:id/validate` | Yes | Validate a deck |
| GET | `/api/dashboard` | Yes | Get player dashboard |
| GET | `/api/statistics` | No | Global statistics |
| GET | `/api/statistics/me` | Yes | Personal statistics |
| GET | `/api/statistics/leaderboard` | No | Leaderboard |
| GET | `/api/admin/stats` | Admin | Admin overview stats |
| GET | `/api/admin/players` | Admin | List all players |
| POST | `/api/admin/players/:id/ban` | Admin | Ban a player |
| POST | `/api/admin/players/:id/unban` | Admin | Unban a player |
| POST | `/api/admin/cards` | Admin | Add a new card |

## Running Tests

```bash
npm test
```