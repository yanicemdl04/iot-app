const express = require('express');
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} = require('../controllers/activityController');
const { authenticate } = require('../middlewares/auth');
const { validateActivity } = require('../middlewares/validation');

router.use(authenticate);

router.post('/', validateActivity, createActivity);
router.get('/', getActivities);
router.get('/:id', getActivityById);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
