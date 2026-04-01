# README - Changements Authentication (branche feature/authentication)

Ce document decrit uniquement les changements realises sur l'authentification et l'inscription.
Le fichier principal `README.md` n'est pas modifie.

## 1) Objectif metier du changement

A la creation d'un compte, un joueur doit recevoir la possibilite d'ouvrir un booster plus tard.

Contrainte importante:
- Un joueur doit "detenir un booster" sans devoir choisir immediatement un booster de contenu specifique.

## 2) Fichier modifie

- `backend/src/controllers/auth.controller.ts`

Aucun changement structurel de schema Prisma n'a ete ajoute pour cette evolution.

## 3) Ce qui a ete ajoute

### 3.1 Constantes metier dans le controller

Dans `register`, deux constantes sont introduites:
- `STARTER_BOOSTER_QUANTITY = 1`
- `UNOPENED_BOOSTER_NAME = "Booster a choisir"`

But:
- Donner 1 booster de depart.
- Representer un booster "non choisi" via un booster technique unique (nom fixe).

### 3.2 Inscription rendue atomique avec transaction

Le flux de creation de compte est execute dans `prisma.$transaction(...)`.

Operations dans la transaction:
1. Creation de `account`
2. Creation du `gamer` lie au compte
3. `upsert` d'un booster technique `Booster a choisir` (cree s'il n'existe pas, reutilise sinon)
4. Creation de la ligne `booster_detained` pour le gamer avec `quantity = 1`

Pourquoi c'est important:
- Si une etape echoue, toute l'inscription est annulee (pas de donnees partielles incoherentes).

### 3.3 Suppression du blocage "No booster available for new account"

Avant, l'inscription pouvait echouer si aucun booster n'etait trouve.

Maintenant:
- Le booster technique est garanti via `upsert`, donc le register ne depend plus d'un seed prealable pour fonctionner.

## 4) Pourquoi cette approche

Cette solution respecte ton modele actuel `booster_detained(gamer_id, booster_id, quantity)` sans migration immediate.

Avantages:
- Compatible avec l'architecture existante.
- Simple a maintenir.
- Evite les erreurs 500 a l'inscription.
- Permet au joueur de "detenir un booster" avant de choisir un booster concret.

## 5) Comment le flux fonctionne maintenant

### Register (`POST /api/auth/register`)

1. Validation des champs (`name`, `email`, `password`)
2. Verifie si l'email existe deja
3. Hash du mot de passe
4. Transaction:
   - creation account
   - creation gamer
   - upsert booster "Booster a choisir"
   - insertion booster_detained (quantity = 1)
5. Retour HTTP 201 avec les infos du compte

### Login (`POST /api/auth/login`)

Inchange sur le principe:
- Verifie email/mot de passe
- Genere access token JWT
- Genere refresh token JWT + persistence hash en base

## 6) Verification fonctionnelle rapide

Tu peux tester avec `testrequte.http`.

Scenario minimum:
1. Register: doit renvoyer `201`.
2. Login avec le meme compte: doit renvoyer `200`.
3. Verifier en base qu'une ligne existe dans `booster_detained` pour le gamer cree avec `quantity = 1`.

Exemple SQL de controle:

```sql
SELECT bd.gamer_id, bd.booster_id, bd.quantity, b.name AS booster_name
FROM booster_detained bd
JOIN booster b ON b.id = bd.booster_id
WHERE bd.gamer_id = '<GAMER_ID>';
```

Attendu:
- au moins une ligne
- `quantity >= 1`
- `booster_name = 'Booster a choisir'` pour le booster de depart

## 7) Limites et prochaine evolution recommandee

Limite actuelle:
- Le "booster a choisir" est represente par un booster technique (nom fixe).

Evolution possible plus explicite metier:
- Introduire un compteur de boosters non assignes (ex: `pending_booster_count`) pour separer totalement:
  - possession generique de booster
  - possession de boosters specifiques

Cette evolution demanderait une migration de schema et des ajustements de service metier.
