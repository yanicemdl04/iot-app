const prisma = require('../config/database');

const getStatistics = async (req, res, next) => {
  try {
    const { userId, period = 'daily', startDate, endDate } = req.query;

    const targetUserId = userId && (req.user.role === 'COACH' || req.user.role === 'ADMIN')
      ? userId
      : req.user.id;

    // Si des dates sont spécifiées, utiliser celles-ci
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    // Calculer les statistiques depuis les activités
    const activities = await prisma.activity.findMany({
      where: {
        userId: targetUserId,
        startTime: {
          gte: start,
          lte: end,
        },
      },
    });

    const sessions = await prisma.session.findMany({
      where: {
        userId: targetUserId,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: {
        sensorData: true,
      },
    });

    // Calculer les statistiques agrégées
    const stats = {
      totalDistance: activities.reduce((sum, a) => sum + (a.distance || 0), 0),
      totalDuration: activities.reduce((sum, a) => sum + (a.duration || 0), 0),
      totalCalories: activities.reduce((sum, a) => sum + (a.calories || 0), 0),
      activitiesCount: activities.length,
      sessionsCount: sessions.length,
      averageHeartRate: calculateAverageHeartRate(sessions),
      maxHeartRate: calculateMaxHeartRate(sessions),
      totalSteps: calculateTotalSteps(sessions),
    };

    res.json({
      success: true,
      data: {
        period,
        startDate: start,
        endDate: end,
        ...stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

const calculateAverageHeartRate = (sessions) => {
  const allHeartRates = [];
  sessions.forEach(session => {
    session.sensorData.forEach(data => {
      if (data.heartRate) {
        allHeartRates.push(data.heartRate);
      }
    });
  });
  if (allHeartRates.length === 0) return null;
  return allHeartRates.reduce((a, b) => a + b, 0) / allHeartRates.length;
};

const calculateMaxHeartRate = (sessions) => {
  const allHeartRates = [];
  sessions.forEach(session => {
    session.sensorData.forEach(data => {
      if (data.heartRate) {
        allHeartRates.push(data.heartRate);
      }
    });
  });
  if (allHeartRates.length === 0) return null;
  return Math.max(...allHeartRates);
};

const calculateTotalSteps = (sessions) => {
  let totalSteps = 0;
  sessions.forEach(session => {
    session.sensorData.forEach(data => {
      if (data.steps) {
        totalSteps += data.steps;
      }
    });
  });
  return totalSteps;
};

const getProgressChart = async (req, res, next) => {
  try {
    const { userId, days = 30 } = req.query;

    const targetUserId = userId && (req.user.role === 'COACH' || req.user.role === 'ADMIN')
      ? userId
      : req.user.id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const activities = await prisma.activity.findMany({
      where: {
        userId: targetUserId,
        startTime: {
          gte: startDate,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Grouper par jour
    const dailyStats = {};
    activities.forEach(activity => {
      const date = activity.startTime.toISOString().split('T')[0];
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          distance: 0,
          calories: 0,
          duration: 0,
          activitiesCount: 0,
        };
      }
      dailyStats[date].distance += activity.distance || 0;
      dailyStats[date].calories += activity.calories || 0;
      dailyStats[date].duration += activity.duration || 0;
      dailyStats[date].activitiesCount += 1;
    });

    const chartData = Object.values(dailyStats);

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
  getProgressChart,
};
