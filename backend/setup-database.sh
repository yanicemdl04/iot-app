#!/bin/bash

# Script Bash pour configurer la base de données PostgreSQL
# Usage: ./setup-database.sh

echo "========================================"
echo "Configuration de la base de données"
echo "========================================"
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Le fichier .env n'existe pas!"
    echo ""
    echo "Création du fichier .env..."
    
    read -p "Entrez votre DATABASE_URL (ex: postgresql://postgres:password@localhost:5432/brassard_iot?schema=public): " database_url
    read -p "Entrez votre JWT_SECRET (ou appuyez sur Entrée pour utiliser la valeur par défaut): " jwt_secret
    
    if [ -z "$jwt_secret" ]; then
        jwt_secret="your-super-secret-jwt-key-change-this-in-production"
    fi
    
    cat > .env << EOF
# Database
DATABASE_URL="$database_url"

# JWT
JWT_SECRET="$jwt_secret"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
EOF
    
    echo "✅ Fichier .env créé!"
    echo ""
else
    echo "✅ Fichier .env trouvé"
    echo ""
fi

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    echo "✅ Dépendances installées!"
    echo ""
else
    echo "✅ Dépendances déjà installées"
    echo ""
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npm run prisma:generate
if [ $? -eq 0 ]; then
    echo "✅ Client Prisma généré!"
    echo ""
else
    echo "❌ Erreur lors de la génération du client Prisma"
    exit 1
fi

# Effectuer la migration
echo "🚀 Exécution de la migration Prisma..."
echo "   (Si c'est la première fois, entrez 'init' comme nom de migration)"
npm run prisma:migrate
if [ $? -eq 0 ]; then
    echo "✅ Migration effectuée avec succès!"
    echo ""
else
    echo "❌ Erreur lors de la migration"
    echo "   Vérifiez que:"
    echo "   1. PostgreSQL est démarré"
    echo "   2. La base de données 'brassard_iot' existe"
    echo "   3. Le DATABASE_URL dans .env est correct"
    exit 1
fi

# Demander si on veut peupler la base de données
echo ""
read -p "Voulez-vous peupler la base de données avec des données de test? (O/N): " seed
if [ "$seed" = "O" ] || [ "$seed" = "o" ] || [ "$seed" = "Y" ] || [ "$seed" = "y" ]; then
    echo "🌱 Peuplement de la base de données..."
    npm run prisma:seed
    if [ $? -eq 0 ]; then
        echo "✅ Base de données peuplée!"
        echo ""
        echo "Comptes créés:"
        echo "  - Admin:  admin@brassard.io / admin123"
        echo "  - Coach:   coach@brassard.io / coach123"
        echo "  - Athlète: athlete@brassard.io / athlete123"
    fi
fi

echo ""
echo "========================================"
echo "✅ Configuration terminée!"
echo "========================================"
echo ""
echo "Pour démarrer le serveur:"
echo "  npm run dev"
echo ""
echo "Pour visualiser la base de données:"
echo "  npm run prisma:studio"
echo ""
