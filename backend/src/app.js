const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config/config');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Brassard IoT - Suivi des performances sportives',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      sessions: '/api/sessions',
      sensorData: '/api/sensor-data',
      activities: '/api/activities',
      goals: '/api/goals',
      statistics: '/api/statistics',
    },
  });
});

// Gestion des erreurs
app.use(errorHandler);

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

module.exports = app;
