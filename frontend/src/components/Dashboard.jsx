import { motion } from 'framer-motion'
import SensorCard from './SensorCard'
import HeartRateChart from './HeartRateChart'
import ActivityChart from './ActivityChart'
import { 
  FaHeartbeat, 
  FaThermometerHalf, 
  FaRunning, 
  FaFire, 
  FaBatteryThreeQuarters,
  FaWifi,
  FaBluetooth,
  FaTint,
  FaLungs
} from 'react-icons/fa'
import './Dashboard.css'

const Dashboard = ({ sensorData }) => {
  const sensors = [
    {
      id: 'heartRate',
      title: 'Fréquence Cardiaque',
      value: sensorData.heartRate,
      unit: 'bpm',
      icon: FaHeartbeat,
      color: '#FF6B6B',
      status: sensorData.heartRate > 100 ? 'Élevé' : sensorData.heartRate < 60 ? 'Faible' : 'Normal'
    },
    {
      id: 'temperature',
      title: 'Température',
      value: sensorData.temperature,
      unit: '°C',
      icon: FaThermometerHalf,
      color: '#4ECDC4',
      status: sensorData.temperature > 37.5 ? 'Élevée' : 'Normale'
    },
    {
      id: 'steps',
      title: 'Pas',
      value: Math.floor(sensorData.steps),
      unit: '',
      icon: FaRunning,
      color: '#95E1D3',
      status: 'Actif'
    },
    {
      id: 'calories',
      title: 'Calories',
      value: Math.floor(sensorData.calories),
      unit: 'kcal',
      icon: FaFire,
      color: '#FFA07A',
      status: 'Brûlées'
    },
    {
      id: 'hydration',
      title: 'Hydratation',
      value: Math.floor(75 + Math.random() * 20), // Valeur simulée entre 75-95%
      unit: '%',
      icon: FaTint,
      color: '#87CEEB',
      status: 'Optimal'
    },
    {
      id: 'oxygen',
      title: 'Saturation O2',
      value: Math.floor(96 + Math.random() * 3), // Valeur simulée entre 96-99%
      unit: '%',
      icon: FaLungs,
      color: '#DDA0DD',
      status: 'Normal'
    }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      <motion.div 
        className="dashboard-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <header className="dashboard-header">
          <div className="header-content">
            <motion.h1 
              className="dashboard-title"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Brassard Sportif Intelligent
            </motion.h1>
            <div className="header-status">
              <motion.div 
                className="status-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <FaWifi className="status-icon" />
                <span>Connecté</span>
              </motion.div>
              <motion.div 
                className="status-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaBluetooth className="status-icon" />
                <span>Bluetooth</span>
              </motion.div>
              <motion.div 
                className="status-item battery"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <FaBatteryThreeQuarters className="status-icon" />
                <span>{Math.floor(sensorData.battery)}%</span>
              </motion.div>
            </div>
          </div>
        </header>

        <div className="sensors-grid">
          {sensors.map((sensor, index) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <SensorCard sensor={sensor} />
            </motion.div>
          ))}
        </div>

        <div className="charts-section">
          <motion.div
            className="chart-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <HeartRateChart data={sensorData} />
          </motion.div>
          
          <motion.div
            className="chart-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ActivityChart data={sensorData} />
          </motion.div>
        </div>

        <div className="motion-sensors">
          <motion.div
            className="motion-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3>Accéléromètre</h3>
            <div className="motion-values">
              <div className="motion-value">
                <span className="axis-label">X</span>
                <span className="axis-value">{sensorData.accelerometer.x.toFixed(2)}</span>
              </div>
              <div className="motion-value">
                <span className="axis-label">Y</span>
                <span className="axis-value">{sensorData.accelerometer.y.toFixed(2)}</span>
              </div>
              <div className="motion-value">
                <span className="axis-label">Z</span>
                <span className="axis-value">{sensorData.accelerometer.z.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="motion-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3>Gyroscope</h3>
            <div className="motion-values">
              <div className="motion-value">
                <span className="axis-label">X</span>
                <span className="axis-value">{sensorData.gyroscope.x.toFixed(2)}</span>
              </div>
              <div className="motion-value">
                <span className="axis-label">Y</span>
                <span className="axis-value">{sensorData.gyroscope.y.toFixed(2)}</span>
              </div>
              <div className="motion-value">
                <span className="axis-label">Z</span>
                <span className="axis-value">{sensorData.gyroscope.z.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
