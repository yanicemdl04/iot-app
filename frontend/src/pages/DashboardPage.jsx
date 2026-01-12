import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import { api } from '../services/api';

const DashboardPage = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const statsRes = await api.getStatistics({ period: 'daily' });
        const stats = statsRes.data;

        const data = {
          heartRate: Math.round(stats.averageHeartRate || 72),
          temperature: 36.5,
          accelerometer: { x: 0, y: 0, z: 0 },
          gyroscope: { x: 0, y: 0, z: 0 },
          steps: stats.totalSteps || 0,
          calories: stats.totalCalories || 0,
          battery: 85,
        };

        if (active) {
          setSensorData(data);
        }
      } catch {
        if (active) {
          // Valeurs par défaut si l’API échoue
          setSensorData({
            heartRate: 72,
            temperature: 36.5,
            accelerometer: { x: 0, y: 0, z: 0 },
            gyroscope: { x: 0, y: 0, z: 0 },
            steps: 0,
            calories: 0,
            battery: 85,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading || !sensorData) {
    return (
      <Layout>
        <p style={{ color: 'rgba(148, 163, 184, 0.9)' }}>Chargement des données du brassard...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Dashboard sensorData={sensorData} />
    </Layout>
  );
};

export default DashboardPage;

