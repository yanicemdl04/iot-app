const express = require('express');
const router = express.Router();
const {
  getStatistics,
  getProgressChart,
} = require('../controllers/statisticsController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.get('/', getStatistics);
router.get('/chart', getProgressChart);

module.exports = router;
