# Résolution des erreurs de migration Prisma

## Erreur P1002 : Timeout de connexion

### Symptômes
```
Error: P1002
The database server at `localhost:5432` was reached but timed out.
Timed out trying to acquire a postgres advisory lock
```

### Causes possibles

1. **PostgreSQL n'est pas démarré**
2. **Une autre connexion bloque la base de données**
3. **Le port PostgreSQL est incorrect**
4. **Les identifiants dans .env sont incorrects**

### Solutions

#### 1. Vérifier que PostgreSQL est démarré

**Windows :**
```powershell
# Vérifier le service
Get-Service -Name postgresql*

# Démarrer le service si nécessaire
Start-Service -Name postgresql-x64-XX  # Remplacez XX par votre version
```

Ou via l'interface graphique :
- Ouvrez `services.msc`
- Cherchez "postgresql"
- Vérifiez qu'il est "En cours d'exécution"
- Si non, cliquez droit → Démarrer

**Linux :**
```bash
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Mac :**
```bash
brew services list
brew services start postgresql
```

#### 2. Tester la connexion

```bash
npm run test:db
```

Ce script vérifie :
- La connexion à PostgreSQL
- L'existence de la base de données
- Les tables existantes

#### 3. Vérifier le fichier .env

Assurez-vous que votre `.env` contient :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/brassard_iot?schema=public"
```

**Points à vérifier :**
- Le mot de passe est correct
- Le port est 5432 (ou votre port personnalisé)
- Le nom de la base est `brassard_iot`
- L'utilisateur est `postgres` (ou votre utilisateur)

#### 4. Vérifier les connexions actives

Connectez-vous à PostgreSQL et vérifiez les connexions :

```sql
-- Se connecter
psql -U postgres

-- Voir les connexions actives
SELECT pid, usename, datname, state, query 
FROM pg_stat_activity 
WHERE datname = 'brassard_iot';

-- Si nécessaire, tuer une connexion bloquante
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'brassard_iot' AND pid <> pg_backend_pid();
```

#### 5. Réessayer la migration

Après avoir résolu le problème :

```bash
npm run prisma:migrate
```

## Erreur P1001 : Impossible de se connecter

### Symptômes
```
Error: P1001
Can't reach database server at `localhost:5432`
```

### Solutions

1. **Vérifier que PostgreSQL écoute sur le bon port**
   - Par défaut : 5432
   - Vérifiez dans `postgresql.conf` : `port = 5432`

2. **Vérifier le firewall**
   - Assurez-vous que le port 5432 n'est pas bloqué

3. **Vérifier l'adresse dans DATABASE_URL**
   - Utilisez `localhost` ou `127.0.0.1`
   - Si PostgreSQL est sur une autre machine, utilisez l'IP

## Erreur P1000 : Base de données non trouvée

### Symptômes
```
Error: P1000
Authentication failed against database server
```

### Solutions

1. **Créer la base de données**
```sql
psql -U postgres
CREATE DATABASE brassard_iot;
\q
```

2. **Vérifier les permissions**
```sql
GRANT ALL PRIVILEGES ON DATABASE brassard_iot TO postgres;
```

## Erreur : "relation already exists"

### Symptômes
```
Error: relation "users" already exists
```

### Solutions

1. **Réinitialiser la base de données** (⚠️ supprime toutes les données)
```bash
npx prisma migrate reset
```

2. **Ou supprimer manuellement les tables**
```sql
DROP TABLE IF EXISTS sensor_data CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Puis relancer la migration :
```bash
npm run prisma:migrate
```

## Commandes utiles

```bash
# Tester la connexion
npm run test:db

# Générer le client Prisma
npm run prisma:generate

# Effectuer la migration
npm run prisma:migrate

# Réinitialiser (⚠️ supprime toutes les données)
npx prisma migrate reset

# Visualiser la base
npm run prisma:studio
```
