const prisma = require('../config/database');

const createGoal = async (req, res, next) => {
  try {
    const {
      title,
      description,
      targetValue,
      unit,
      targetDate,
      activityType,
    } = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId: req.user.id,
        title,
        description,
        targetValue,
        unit,
        targetDate: new Date(targetDate),
        activityType,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Objectif créé avec succès',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

const getGoals = async (req, res, next) => {
  try {
    const { userId, status, activityType } = req.query;

    const where = {};

    // Si l'utilisateur est un coach, il peut voir les objectifs de ses athlètes
    if (userId && (req.user.role === 'COACH' || req.user.role === 'ADMIN')) {
      where.userId = userId;
    } else {
      // Sinon, seulement ses propres objectifs
      where.userId = req.user.id;
    }

    if (status) {
      where.status = status;
    }

    if (activityType) {
      where.activityType = activityType;
    }

    const goals = await prisma.goal.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        targetDate: 'asc',
      },
    });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

const getGoalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
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
      },
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé',
      });
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Vérifier que l'objectif appartient à l'utilisateur
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingGoal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé',
      });
    }

    // Convertir la date si présente
    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate);
    }

    // Mettre à jour le statut automatiquement si nécessaire
    if (updateData.currentValue !== undefined) {
      const progress = (updateData.currentValue / existingGoal.targetValue) * 100;
      if (progress >= 100) {
        updateData.status = 'COMPLETED';
      } else if (progress > 0) {
        updateData.status = 'IN_PROGRESS';
      }
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Objectif mis à jour avec succès',
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier que l'objectif appartient à l'utilisateur
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingGoal) {
      return res.status(404).json({
        success: false,
        message: 'Objectif non trouvé',
      });
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Objectif supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
