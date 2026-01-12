const jwt = require('jsonwebtoken');
const config = require('../config/config');
const prisma = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'authentification manquant' 
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      
      // Vérifier que l'utilisateur existe toujours
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Utilisateur non trouvé' 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur d\'authentification', 
      error: error.message 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Non authentifié' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès refusé. Rôle insuffisant.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
