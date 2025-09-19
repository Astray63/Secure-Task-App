# Secure Task App

Application web sécurisée de gestion de tâches (API REST) mise en place dans le cadre de l'activité-type 1: Développer une application sécurisée.

## Objectifs de l'environnement
1. Environnement Node.js / Express sécurisé
2. Base MySQL conteneurisée
3. Gestion des secrets via `.env`
4. Docker & docker-compose pour la portabilité
5. Bonnes pratiques: Helmet, rate limiting, validation, logs, hash mots de passe

## Stack
- Node.js / Express
- MySQL 8
- Docker / docker-compose
- Authentification JWT
- Validation Joi

## Démarrage rapide
```bash
cp .env.example .env
# (Éditer .env et mettre des valeurs fortes)
docker compose up -d --build
docker compose exec api npm run db:init
```

Tester la santé:
```bash
curl http://localhost:3000/health
```

### Inscription / Connexion
```bash
curl -X POST http://localhost:3000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Password1"}'

curl -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"Password1"}'
```

Utiliser le token retourné:
```bash
curl -H 'Authorization: Bearer <TOKEN>' http://localhost:3000/api/tasks
```

### Création tâche
```bash
curl -X POST http://localhost:3000/api/tasks -H 'Authorization: Bearer <TOKEN>' -H 'Content-Type: application/json' \
  -d '{"title":"Ma première tâche","description":"Texte"}'
```

## Scripts npm
- `npm run dev` : développement (nodemon)
- `npm start` : production
- `npm run db:init` : création des tables

### Exécuter en local sans tout Docker

Si vous lancez uniquement Node.js en local (npm run dev) et que vous voyez l'erreur `getaddrinfo ENOTFOUND db`, c'est que `DB_HOST=db` (prévu pour docker-compose) n'est pas résolu.

Deux options rapides:

1) Lancer juste MySQL via Docker et pointer dessus depuis le local
```bash
docker compose up -d db
cp .env.local.example .env.local
# .env.local définit DB_HOST=127.0.0.1 et DB_PORT=3307
npm run db:init
npm run dev
```

2) Installer MySQL en local et adapter `.env.local` (DB_HOST=127.0.0.1, DB_PORT=3306, utilisateur/mot de passe choisis), puis:
```bash
npm run db:init
npm run dev
```

Note: l'application charge `.env` puis surcharge avec `.env.local` si présent.

## Structure
```
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  validation/
scripts/db-init.js
```

## Sécurité
Voir `SECURITY.md`.

## Frontend minimal
Un frontend statique (HTML/CSS/JS) est disponible dans `public/` et servi automatiquement par Express.

Accès: http://localhost:3000/

Fonctionnalités:
- Inscription / connexion (affiche un extrait du token)
- Liste des tâches après connexion
- Création, bascule completed, suppression

Le code JS consomme l'API via les routes `/api/*`.

Pour modifier le style: éditer `public/style.css`.

Pour étendre (exemples):
- Ajouter persistance du token dans `localStorage`
- Gérer les erreurs de validation détaillées
- Pagination / recherche tâches

## Période
Projet réalisé en autonomie.

