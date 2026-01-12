const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testConnection() {
  console.log('🔍 Test de connexion à PostgreSQL...\n');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    // Test de connexion simple
    await prisma.$connect();
    console.log('✅ Connexion réussie!\n');

    // Test d'une requête simple
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Version PostgreSQL:', result[0].version);
    console.log('');

    // Vérifier si la base de données existe
    const dbResult = await prisma.$queryRaw`
      SELECT datname FROM pg_database WHERE datname = 'brassard_iot'
    `;
    
    if (dbResult.length > 0) {
      console.log('✅ Base de données "brassard_iot" trouvée\n');
    } else {
      console.log('⚠️  Base de données "brassard_iot" non trouvée\n');
    }

    // Vérifier les tables existantes
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    if (tables.length > 0) {
      console.log('📋 Tables existantes:');
      tables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
      console.log('');
    } else {
      console.log('ℹ️  Aucune table trouvée (normal pour une nouvelle base)\n');
    }

    console.log('✅ Tous les tests sont passés!\n');
    console.log('Vous pouvez maintenant exécuter: npm run prisma:migrate');

  } catch (error) {
    console.error('❌ Erreur de connexion:\n');
    console.error('Message:', error.message);
    console.error('');
    
    if (error.code === 'P1001') {
      console.error('💡 Solutions possibles:');
      console.error('   1. Vérifiez que PostgreSQL est démarré');
      console.error('   2. Vérifiez le port dans DATABASE_URL (par défaut: 5432)');
      console.error('   3. Vérifiez les identifiants dans le fichier .env');
    } else if (error.code === 'P1002') {
      console.error('💡 Solutions possibles:');
      console.error('   1. PostgreSQL est peut-être en cours d\'utilisation par un autre processus');
      console.error('   2. Attendez quelques secondes et réessayez');
      console.error('   3. Redémarrez le service PostgreSQL');
    } else if (error.code === 'P1000') {
      console.error('💡 Solutions possibles:');
      console.error('   1. Vérifiez que la base de données existe');
      console.error('   2. Créez la base: CREATE DATABASE brassard_iot;');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
