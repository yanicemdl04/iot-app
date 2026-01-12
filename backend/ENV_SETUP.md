# Configuration des variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend` avec le contenu suivant :

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brassard_iot?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
```

## Explication des variables

- **DATABASE_URL** : URL de connexion à votre base de données PostgreSQL
  - Format : `postgresql://[user]:[password]@[host]:[port]/[database]?schema=public`
  - Exemple : `postgresql://postgres:password@localhost:5432/brassard_iot?schema=public`

- **JWT_SECRET** : Clé secrète pour signer les tokens JWT (changez-la en production !)

- **JWT_EXPIRES_IN** : Durée de validité des tokens (ex: "7d", "24h", "1h")

- **PORT** : Port sur lequel le serveur écoute (par défaut 3000)

- **NODE_ENV** : Environnement d'exécution (development, production, test)

- **CORS_ORIGIN** : URL d'origine autorisée pour les requêtes CORS (correspond à l'URL de votre frontend)
