const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
} = require('../controllers/sessionController');
const { authenticate } = require('../middlewares/auth');
const { validateSession } = require('../middlewares/validation');

router.use(authenticate);

router.post('/', validateSession, createSession);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
