const prisma = require('../config/database');

const createSession = async (req, res, next) => {
  try {
    const { activityType, notes } = req.body;

    const session = await prisma.session.create({
      data: {
        userId: req.user.id,
        activityType,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Session créée avec succès',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const getSessions = async (req, res, next) => {
  try {
    const { userId, startDate, endDate, activityType, limit = 50, offset = 0 } = req.query;

    const where = {};

    // Si l'utilisateur est un coach, il peut voir les sessions de ses athlètes
    if (userId && (req.user.role === 'COACH' || req.user.role === 'ADMIN')) {
      where.userId = userId;
    } else {
      // Sinon, seulement ses propres sessions
      where.userId = req.user.id;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    if (activityType) {
      where.activityType = activityType;
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              sensorData: true,
              activities: true,
            },
          },
        },
        orderBy: {
          startTime: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.session.count({ where }),
    ]);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSessionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: {
        id,
        ...(req.user.role !== 'COACH' && req.user.role !== 'ADMIN' ? { userId: req.user.id } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        sensorData: {
          orderBy: {
            timestamp: 'asc',
          },
          take: 1000, // Limiter pour éviter les réponses trop lourdes
        },
        activities: true,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const updateSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { endTime, duration, activityType, notes } = req.body;

    // Vérifier que la session appartient à l'utilisateur
    const existingSession = await prisma.session.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const session = await prisma.session.update({
      where: { id },
      data: {
        ...(endTime && { endTime: new Date(endTime) }),
        ...(duration !== undefined && { duration }),
        ...(activityType && { activityType }),
        ...(notes !== undefined && { notes }),
      },
    });

    res.json({
      success: true,
      message: 'Session mise à jour avec succès',
      data: session,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier que la session appartient à l'utilisateur
    const existingSession = await prisma.session.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    await prisma.session.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Session supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
};
