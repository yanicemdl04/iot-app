const app = require('./app');
const config = require('./config/config');
const prisma = require('./config/database');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 Environnement: ${config.nodeEnv}`);
  console.log(`🌐 API disponible sur: http://localhost:${PORT}`);
});

// Gestion de l'arrêt propre
process.on('SIGTERM', async () => {
  console.log('SIGTERM reçu, arrêt du serveur...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Serveur arrêté proprement');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT reçu, arrêt du serveur...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Serveur arrêté proprement');
    process.exit(0);
  });
});
