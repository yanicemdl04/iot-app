# Script PowerShell pour configurer la base de données PostgreSQL
# Usage: .\setup-database.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration de la base de données" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si .env existe
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  Le fichier .env n'existe pas!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Création du fichier .env..." -ForegroundColor Yellow
    
    $databaseUrl = Read-Host "Entrez votre DATABASE_URL (ex: postgresql://postgres:password@localhost:5432/brassard_iot?schema=public)"
    $jwtSecret = Read-Host "Entrez votre JWT_SECRET (ou appuyez sur Entrée pour utiliser la valeur par défaut)"
    
    if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
        $jwtSecret = "your-super-secret-jwt-key-change-this-in-production"
    }
    
    $envContent = @"
# Database
DATABASE_URL="$databaseUrl"

# JWT
JWT_SECRET="$jwtSecret"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:5173"
"@
    
    Set-Content -Path ".env" -Value $envContent
    Write-Host "✅ Fichier .env créé!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
    Write-Host ""
}

# Vérifier si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dépendances installées!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
    Write-Host ""
}

# Générer le client Prisma
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Client Prisma généré!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
    exit 1
}

# Effectuer la migration
Write-Host "🚀 Exécution de la migration Prisma..." -ForegroundColor Yellow
Write-Host "   (Si c'est la première fois, entrez 'init' comme nom de migration)" -ForegroundColor Gray
npm run prisma:migrate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration effectuée avec succès!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Erreur lors de la migration" -ForegroundColor Red
    Write-Host "   Vérifiez que:" -ForegroundColor Yellow
    Write-Host "   1. PostgreSQL est démarré" -ForegroundColor Yellow
    Write-Host "   2. La base de données 'brassard_iot' existe" -ForegroundColor Yellow
    Write-Host "   3. Le DATABASE_URL dans .env est correct" -ForegroundColor Yellow
    exit 1
}

# Demander si on veut peupler la base de données
Write-Host ""
$seed = Read-Host "Voulez-vous peupler la base de données avec des données de test? (O/N)"
if ($seed -eq "O" -or $seed -eq "o" -or $seed -eq "Y" -or $seed -eq "y") {
    Write-Host "🌱 Peuplement de la base de données..." -ForegroundColor Yellow
    npm run prisma:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données peuplée!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Comptes créés:" -ForegroundColor Cyan
        Write-Host "  - Admin:  admin@brassard.io / admin123" -ForegroundColor White
        Write-Host "  - Coach:   coach@brassard.io / coach123" -ForegroundColor White
        Write-Host "  - Athlète: athlete@brassard.io / athlete123" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour démarrer le serveur:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Pour visualiser la base de données:" -ForegroundColor Yellow
Write-Host "  npm run prisma:studio" -ForegroundColor White
Write-Host ""
