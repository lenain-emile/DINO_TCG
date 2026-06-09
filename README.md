# DINO TCG

Application fullstack de jeu de cartes à collectionner (Trading Card Game) en ligne, développée dans le cadre d'un projet fil rouge de 4 semaines en équipe de 3.

## Contexte

**TCG Arena** est une startup souhaitant lancer un TCG en ligne. Les joueurs collectionnent des cartes, construisent des decks et s'affrontent en duel stratégique.

L'objectif est de livrer un MVP fullstack avec une architecture propre et maintenable.

## 🛠️ Stack technique & Configuration

### Frontend (Client)
- **Cœur** : React 19 + TypeScript + Vite
- **Stylisation** : TailwindCSS
- **Routing** : React Router DOM v7
- **3D & Intro** : Three.js, `@react-three/fiber`, `@react-three/drei`

### Backend (Serveur)
- **Cœur API** : Node.js + Express 5 + TypeScript
- **Base de données** : PostgreSQL hébergé sur **Supabase**
- **ORM** : **Prisma** (v7) (configuration via `prisma.config.ts`, utilisation de Pooler `pgbouncer` pour Supabase)
- **Sécurité/Auth** : `bcryptjs` (hachage) + `jsonwebtoken` (JWT)

---

## 🔐 Validation de l'Authentification & Fonctionnement du Token (JWT)

Le système sécurise les accès via deux éléments :
1. **Access Token** : Badge "rapide" crypté via la clé `JWT_SECRET` (dans le `.env`). C'est ce **token principal** qui valide le développement et que le frontend utilise pour faire des requêtes.
2. **Refresh Token** : Conservé de manière sécurisée en base de données pour régénérer le badge rapide sans reconnexion.

### Comment tester (Flux de développement) :
1. **S'inscrire (`POST /api/auth/register`)** : 
   Envoie un email/password. Le mot de passe est haché en BDD. Le serveur te retourne tes premiers tokens.
2. **Se connecter (`POST /api/auth/login`)** : 
   Envoie tes identifiants. Si c'est bon, le serveur te retourne un `accessToken`.
3. **Prouver son identité (`GET /api/auth/me`)** :
   Copie l'`accessToken` fourni, et passe-le dans les *Headers HTTP* de ta requête de cette façon :
   ```http
   Authorization: Bearer <TON_ACCESS_TOKEN>
   ```
Si le serveur répond avec ton profil utilisateur, c'est que la clé secrète du `.env` a bien authentifié ton jeton. Le système d'authentification est totalement fonctionnel !

---

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
