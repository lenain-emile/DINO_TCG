# DINO TCG

Application fullstack de jeu de cartes à collectionner (Trading Card Game) en ligne, développée dans le cadre d'un projet fil rouge de 4 semaines en équipe de 3.

## Contexte

**TCG Arena** est une startup souhaitant lancer un TCG en ligne. Les joueurs collectionnent des cartes, construisent des decks et s'affrontent en duel stratégique.

L'objectif est de livrer un MVP fullstack avec une architecture propre et maintenable.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Node.js + Express 5 + TypeScript |
| Routing | React Router DOM v7 |
| API | REST — documentée avec Swagger |

## Structure du projet

```
DINO_TCG/
  client/     # Frontend React
  backend/    # API Express
```

## Lancer le projet

```bash
# Frontend
cd client && npm install && npm run dev

# Backend
cd backend && npm install && npm run dev
```

## Univers du jeu

Quatre factions s'affrontent :

| Faction | Spécialité |
|---|---|
| Feu | Dégâts directs élevés |
| Eau | Contrôle et défense |
| Terre | Résistance et endurance |
| Air | Vitesse et esquive |

## Structure d'une carte

| Attribut | Valeur |
|---|---|
| Nom | Identifiant unique |
| Faction | Feu / Eau / Terre / Air |
| Coût en mana | 1 à 10 |
| Points d'attaque | 0 à 15 |
| Points de défense | 0 à 15 |
| Rareté | Commune, Rare, Épique, Légendaire |
| Effet spécial | Optionnel |

## Règles du deck

- Un deck contient **exactement 20 cartes**
- Maximum **3 exemplaires** d'une même carte
- Un joueur peut posséder **plusieurs decks**

## Déroulement d'un duel

1. Chaque joueur commence avec **20 PV** et **3 mana**
2. À chaque tour : **+1 mana** (max 10) + pioche d'1 carte
3. Le joueur joue des cartes selon son mana disponible
4. Les cartes attaquent les cartes adverses ou le joueur directement
5. **Victoire** : réduire les PV adverses à 0
