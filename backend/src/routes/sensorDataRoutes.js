const express = require('express');
const router = express.Router();
const {
  createSensorData,
  createMultipleSensorData,
  getSensorData,
  getLatestSensorData,
  getSensorDataStats,
} = require('../controllers/sensorDataController');
const { authenticate } = require('../middlewares/auth');
const { validateSensorData } = require('../middlewares/validation');

router.use(authenticate);

router.post('/:sessionId', validateSensorData, createSensorData);
router.post('/:sessionId/batch', createMultipleSensorData);
router.get('/:sessionId', getSensorData);
router.get('/:sessionId/latest', getLatestSensorData);
router.get('/:sessionId/stats', getSensorDataStats);

module.exports = router;
