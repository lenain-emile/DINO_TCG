# DINO TCG

Application fullstack de jeu de cartes à collectionner (Trading Card Game) en ligne, développée dans le cadre d'un projet fil rouge de 4 semaines par Emile Lenain, Oussama Halima Filali & Armelle Pouzioux.


**DINO TCG** est un jeu de cartes stratégique où les joueurs s'affrontent en utilisant les créatures les plus redoutables de la préhistoire. Les joueurs collectionnent des dinosaures, construisent des decks synergiques et s'affrontent en duel.

L'objectif est de livrer un MVP fullstack avec une architecture propre et maintenable.

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Routing | React Router DOM |
| API | REST — documentée avec Swagger |

## Structure du projet

```text
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

Cinq grandes familles de dinosaures s'affrontent pour la domination du territoire :

| Faction | Spécialité |
|---|---|
| **Théropodes** | Dégâts massifs et agressivité |
| **Sauropodes** | Tanks ultimes, immenses réserves de points de vie |
| **Cératopsiens** | Équilibre parfait entre attaque et robustesse |
| **Thyréophores** | Défense lourdement armée et ripostes |
| **Ornithopodes** | Polyvalence et dynamique de groupe |

## Structure d'une carte

| Attribut | Description & Valeurs |
|---|---|
| `nom` | Identifiant de la carte (ex: Velociraptor) |
| `faction` | Théropodes, Sauropodes, Cératopsiens, Thyréophores ou Ornithopodes |
| `cout_energie` | De 1 à 10 |
| `attaque` | De 1 à 18 |
| `points_de_vie` | De 1 à 30 |
| `rarete` | Commune, Rare, Épique, Légendaire |

## Règles du deck

- Un deck contient **exactement 20 cartes**
- Maximum **3 exemplaires** d'une même carte
- Un joueur peut posséder **plusieurs decks**

## Déroulement d'un duel

1. Chaque joueur commence avec **20 PV** et **3 énergies**
2. À chaque tour : **+1 énergie** (max 10) + pioche d'1 carte
3. Le joueur invoque des dinosaures selon son énergie disponible
4. Les dinosaures attaquent les cartes adverses ou le joueur directement
5. **Victoire** : réduire les PV du joueur adverse à 0
