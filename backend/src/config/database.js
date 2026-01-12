const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Gestion de la connexion
prisma.$connect()
  .then(() => {
    console.log('✅ Connexion à la base de données PostgreSQL réussie');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à la base de données:', error);
    process.exit(1);
  });

// Gestion de la déconnexion propre
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
