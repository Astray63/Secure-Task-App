# Politique de sécurité

## Bonnes pratiques appliquées
- Variables sensibles dans `.env` (non commit)
- Hash des mots de passe avec bcrypt (salt rounds configurables)
- Limitation de débit (rate limiting)
- En-têtes de sécurité (Helmet)
- Validation des entrées (Joi)
- JWT signé (secret via variable d'environnement, expiration configurable)
- Requêtes SQL paramétrées contre l'injection
- Journaux structurés (Winston)
- Docker pour l'isolation des services

## Recommandations supplémentaires
- Activer l'authentification multi-facteurs sur GitHub
- Scanner les dépendances (npm audit / Snyk)
- Rotation régulière du `JWT_SECRET`
- Sauvegardes chiffrées de la base
