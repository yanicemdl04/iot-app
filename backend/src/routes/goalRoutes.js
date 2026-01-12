const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
} = require('../controllers/goalController');
const { authenticate } = require('../middlewares/auth');
const { validateGoal } = require('../middlewares/validation');

router.use(authenticate);

router.post('/', validateGoal, createGoal);
router.get('/', getGoals);
router.get('/:id', getGoalById);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
