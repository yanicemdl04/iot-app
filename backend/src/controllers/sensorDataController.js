const prisma = require('../config/database');

const createSensorData = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const sensorData = req.body;

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const data = await prisma.sensorData.create({
      data: {
        sessionId,
        ...sensorData,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Données de capteur enregistrées avec succès',
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createMultipleSensorData = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { data: sensorDataArray } = req.body;

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const data = await prisma.sensorData.createMany({
      data: sensorDataArray.map(item => ({
        sessionId,
        ...item,
      })),
    });

    res.status(201).json({
      success: true,
      message: `${data.count} données de capteur enregistrées avec succès`,
      data: { count: data.count },
    });
  } catch (error) {
    next(error);
  }
};

const getSensorData = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { startDate, endDate, limit = 1000, offset = 0 } = req.query;

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const where = { sessionId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      prisma.sensorData.findMany({
        where,
        orderBy: {
          timestamp: 'asc',
        },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.sensorData.count({ where }),
    ]);

    res.json({
      success: true,
      data,
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

const getLatestSensorData = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const data = await prisma.sensorData.findFirst({
      where: { sessionId },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    next(error);
  }
};

const getSensorDataStats = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    // Vérifier que la session existe et appartient à l'utilisateur
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: req.user.id,
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session non trouvée',
      });
    }

    const allData = await prisma.sensorData.findMany({
      where: { sessionId },
      select: {
        heartRate: true,
        temperature: true,
        steps: true,
        calories: true,
        battery: true,
      },
    });

    const stats = {
      heartRate: {
        min: allData.filter(d => d.heartRate).length > 0 
          ? Math.min(...allData.map(d => d.heartRate).filter(v => v !== null)) 
          : null,
        max: allData.filter(d => d.heartRate).length > 0 
          ? Math.max(...allData.map(d => d.heartRate).filter(v => v !== null)) 
          : null,
        avg: allData.filter(d => d.heartRate).length > 0
          ? allData.map(d => d.heartRate).filter(v => v !== null).reduce((a, b) => a + b, 0) / allData.filter(d => d.heartRate).length
          : null,
      },
      temperature: {
        min: allData.filter(d => d.temperature).length > 0
          ? Math.min(...allData.map(d => d.temperature).filter(v => v !== null))
          : null,
        max: allData.filter(d => d.temperature).length > 0
          ? Math.max(...allData.map(d => d.temperature).filter(v => v !== null))
          : null,
        avg: allData.filter(d => d.temperature).length > 0
          ? allData.map(d => d.temperature).filter(v => v !== null).reduce((a, b) => a + b, 0) / allData.filter(d => d.temperature).length
          : null,
      },
      totalSteps: allData.reduce((sum, d) => sum + (d.steps || 0), 0),
      totalCalories: allData.reduce((sum, d) => sum + (d.calories || 0), 0),
      battery: {
        min: allData.filter(d => d.battery).length > 0
          ? Math.min(...allData.map(d => d.battery).filter(v => v !== null))
          : null,
        max: allData.filter(d => d.battery).length > 0
          ? Math.max(...allData.map(d => d.battery).filter(v => v !== null))
          : null,
        avg: allData.filter(d => d.battery).length > 0
          ? allData.map(d => d.battery).filter(v => v !== null).reduce((a, b) => a + b, 0) / allData.filter(d => d.battery).length
          : null,
      },
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSensorData,
  createMultipleSensorData,
  getSensorData,
  getLatestSensorData,
  getSensorDataStats,
};
