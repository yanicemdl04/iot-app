const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // Créer un admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@brassard.io' },
    update: {},
    create: {
      email: 'admin@brassard.io',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Système',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin créé:', admin.email);

  // Créer un coach
  const coachPassword = await bcrypt.hash('coach123', 10);
  const coach = await prisma.user.upsert({
    where: { email: 'coach@brassard.io' },
    update: {},
    create: {
      email: 'coach@brassard.io',
      password: coachPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'COACH',
    },
  });

  console.log('✅ Coach créé:', coach.email);

  // Créer un athlète
  const athletePassword = await bcrypt.hash('athlete123', 10);
  const athlete = await prisma.user.upsert({
    where: { email: 'athlete@brassard.io' },
    update: {},
    create: {
      email: 'athlete@brassard.io',
      password: athletePassword,
      firstName: 'Marie',
      lastName: 'Martin',
      role: 'ATHLETE',
      coachId: coach.id,
    },
  });

  console.log('✅ Athlète créé:', athlete.email);

  // Créer une session d'exemple
  const session = await prisma.session.create({
    data: {
      userId: athlete.id,
      activityType: 'RUNNING',
      notes: 'Session d\'entraînement de test',
    },
  });

  console.log('✅ Session créée:', session.id);

  // Créer quelques données de capteur d'exemple
  const sensorData = [];
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (10 - i));
    
    sensorData.push({
      sessionId: session.id,
      heartRate: 70 + Math.random() * 30,
      temperature: 36.5 + Math.random() * 0.5,
      accelX: (Math.random() - 0.5) * 2,
      accelY: (Math.random() - 0.5) * 2,
      accelZ: (Math.random() - 0.5) * 2,
      steps: i * 100,
      calories: i * 5,
      battery: 100 - i * 0.5,
      timestamp,
    });
  }

  await prisma.sensorData.createMany({
    data: sensorData,
  });

  console.log('✅ Données de capteur créées:', sensorData.length);

  // Créer un objectif d'exemple
  const goal = await prisma.goal.create({
    data: {
      userId: athlete.id,
      title: 'Courir 10 km cette semaine',
      description: 'Objectif de distance pour la semaine',
      targetValue: 10000,
      unit: 'm',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
      activityType: 'RUNNING',
      status: 'IN_PROGRESS',
      currentValue: 3500,
    },
  });

  console.log('✅ Objectif créé:', goal.title);

  console.log('\n🎉 Seed terminé avec succès!');
  console.log('\n📝 Comptes créés:');
  console.log('   Admin:  admin@brassard.io / admin123');
  console.log('   Coach:  coach@brassard.io / coach123');
  console.log('   Athlète: athlete@brassard.io / athlete123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
