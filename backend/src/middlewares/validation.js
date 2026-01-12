const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array(),
    });
  }
  next();
};

// Validations pour l'authentification
const validateRegister = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName').notEmpty().withMessage('Le prénom est requis'),
  body('lastName').notEmpty().withMessage('Le nom est requis'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  handleValidationErrors,
];

// Validations pour les sessions
const validateSession = [
  body('activityType').optional().isIn(['RUNNING', 'CYCLING', 'WALKING', 'SWIMMING', 'GYM', 'OTHER']),
  handleValidationErrors,
];

// Validations pour les données de capteurs
const validateSensorData = [
  body('heartRate').optional().isFloat({ min: 0, max: 250 }),
  body('temperature').optional().isFloat({ min: 30, max: 45 }),
  body('spo2').optional().isFloat({ min: 0, max: 100 }),
  body('accelX').optional().isFloat(),
  body('accelY').optional().isFloat(),
  body('accelZ').optional().isFloat(),
  body('gyroX').optional().isFloat(),
  body('gyroY').optional().isFloat(),
  body('gyroZ').optional().isFloat(),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('altitude').optional().isFloat(),
  body('ecgValue').optional().isFloat(),
  body('steps').optional().isInt({ min: 0 }),
  body('calories').optional().isFloat({ min: 0 }),
  body('battery').optional().isFloat({ min: 0, max: 100 }),
  handleValidationErrors,
];

// Validations pour les activités
const validateActivity = [
  body('activityType').isIn(['RUNNING', 'CYCLING', 'WALKING', 'SWIMMING', 'GYM', 'OTHER']),
  body('name').notEmpty().withMessage('Le nom de l\'activité est requis'),
  body('startTime').isISO8601().withMessage('Date de début invalide'),
  body('endTime').optional().isISO8601(),
  body('distance').optional().isFloat({ min: 0 }),
  body('calories').optional().isFloat({ min: 0 }),
  handleValidationErrors,
];

// Validations pour les objectifs
const validateGoal = [
  body('title').notEmpty().withMessage('Le titre est requis'),
  body('targetValue').isFloat({ min: 0 }).withMessage('La valeur cible doit être positive'),
  body('unit').notEmpty().withMessage('L\'unité est requise'),
  body('targetDate').isISO8601().withMessage('Date cible invalide'),
  body('activityType').optional().isIn(['RUNNING', 'CYCLING', 'WALKING', 'SWIMMING', 'GYM', 'OTHER']),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateSession,
  validateSensorData,
  validateActivity,
  validateGoal,
  handleValidationErrors,
};
