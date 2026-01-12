const prisma = require('../config/database');

const createActivity = async (req, res, next) => {
  try {
    const {
      sessionId,
      activityType,
      name,
      description,
      startTime,
      endTime,
      duration,
      distance,
      averageSpeed,
      maxSpeed,
      averageHeartRate,
      maxHeartRate,
      calories,
    } = req.body;

    const activity = await prisma.activity.create({
      data: {
        userId: req.user.id,
        sessionId,
        activityType,
        name,
        description,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration,
        distance,
        averageSpeed,
        maxSpeed,
        averageHeartRate,
        maxHeartRate,
        calories,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        session: {
          select: {
            id: true,
            startTime: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Activité créée avec succès',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const getActivities = async (req, res, next) => {
  try {
    const { userId, activityType, startDate, endDate, limit = 50, offset = 0 } = req.query;

    const where = {};

    // Si l'utilisateur est un coach, il peut voir les activités de ses athlètes
    if (userId && (req.user.role === 'COACH' || req.user.role === 'ADMIN')) {
      where.userId = userId;
    } else {
      // Sinon, seulement ses propres activités
      where.userId = req.user.id;
    }

    if (activityType) {
      where.activityType = activityType;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) where.startTime.gte = new Date(startDate);
      if (endDate) where.startTime.lte = new Date(endDate);
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          session: {
            select: {
              id: true,
              startTime: true,
            },
          },
        },
        orderBy: {
          startTime: 'desc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.activity.count({ where }),
    ]);

    res.json({
      success: true,
      data: activities,
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

const getActivityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const activity = await prisma.activity.findFirst({
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
        session: {
          include: {
            sensorData: {
              take: 100,
              orderBy: {
                timestamp: 'asc',
              },
            },
          },
        },
      },
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée',
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const updateActivity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que l'activité appartient à l'utilisateur
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée',
      });
    }

    // Convertir les dates si présentes
    if (updateData.startTime) updateData.startTime = new Date(updateData.startTime);
    if (updateData.endTime) updateData.endTime = new Date(updateData.endTime);

    const activity = await prisma.activity.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Activité mise à jour avec succès',
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

const deleteActivity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier que l'activité appartient à l'utilisateur
    const existingActivity = await prisma.activity.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingActivity) {
      return res.status(404).json({
        success: false,
        message: 'Activité non trouvée',
      });
    }

    await prisma.activity.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Activité supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
