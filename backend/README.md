# Backend - Brassard IoT App

Backend pour l'application de suivi des performances sportives avec brassard IoT.

## Technologies

- **Node.js** avec **Express**
- **PostgreSQL** comme base de données
- **Prisma** comme ORM
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer la base de données :
   - Créer un fichier `.env` à partir de `.env.example`
   - Configurer la variable `DATABASE_URL` avec vos identifiants PostgreSQL
   - Configurer `JWT_SECRET` avec une clé secrète

3. Initialiser Prisma :
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. (Optionnel) Peupler la base de données :
```bash
npm run prisma:seed
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Structure de l'API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (authentifié)
- `PUT /api/auth/profile` - Mise à jour du profil (authentifié)

### Sessions
- `POST /api/sessions` - Créer une session
- `GET /api/sessions` - Liste des sessions
- `GET /api/sessions/:id` - Détails d'une session
- `PUT /api/sessions/:id` - Mettre à jour une session
- `DELETE /api/sessions/:id` - Supprimer une session

### Données de capteurs
- `POST /api/sensor-data/:sessionId` - Enregistrer des données de capteur
- `POST /api/sensor-data/:sessionId/batch` - Enregistrer plusieurs données
- `GET /api/sensor-data/:sessionId` - Récupérer les données d'une session
- `GET /api/sensor-data/:sessionId/latest` - Dernière donnée
- `GET /api/sensor-data/:sessionId/stats` - Statistiques d'une session

### Activités
- `POST /api/activities` - Créer une activité
- `GET /api/activities` - Liste des activités
- `GET /api/activities/:id` - Détails d'une activité
- `PUT /api/activities/:id` - Mettre à jour une activité
- `DELETE /api/activities/:id` - Supprimer une activité

### Objectifs
- `POST /api/goals` - Créer un objectif
- `GET /api/goals` - Liste des objectifs
- `GET /api/goals/:id` - Détails d'un objectif
- `PUT /api/goals/:id` - Mettre à jour un objectif
- `DELETE /api/goals/:id` - Supprimer un objectif

### Statistiques
- `GET /api/statistics` - Statistiques globales
- `GET /api/statistics/chart` - Données pour graphiques

## Rôles utilisateurs

- **ATHLETE** : Peut voir et gérer ses propres données
- **COACH** : Peut voir les données de ses athlètes assignés
- **ADMIN** : Accès complet

## Base de données

Le schéma Prisma définit les modèles suivants :
- `User` - Utilisateurs (athlètes, coaches, admins)
- `Session` - Sessions d'entraînement
- `SensorData` - Données des capteurs (FC, température, GPS, accéléromètre, etc.)
- `Activity` - Activités sportives
- `Goal` - Objectifs d'entraînement
- `Statistics` - Statistiques agrégées

## Variables d'environnement

Voir `.env.example` pour la liste complète des variables nécessaires.
