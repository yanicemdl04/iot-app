const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const sessionRoutes = require('./sessionRoutes');
const sensorDataRoutes = require('./sensorDataRoutes');
const activityRoutes = require('./activityRoutes');
const goalRoutes = require('./goalRoutes');
const statisticsRoutes = require('./statisticsRoutes');

router.use('/auth', authRoutes);
router.use('/sessions', sessionRoutes);
router.use('/sensor-data', sensorDataRoutes);
router.use('/activities', activityRoutes);
router.use('/goals', goalRoutes);
router.use('/statistics', statisticsRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Brassard IoT - Serveur opérationnel',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
