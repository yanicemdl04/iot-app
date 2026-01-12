import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import './SensorCard.css'

const SensorCard = ({ sensor }) => {
  const [previousValue, setPreviousValue] = useState(sensor.value)
  const Icon = sensor.icon

  useEffect(() => {
    setPreviousValue(sensor.value)
  }, [sensor.value])

  const isIncreasing = sensor.value > previousValue

  return (
    <motion.div
      className="sensor-card"
      style={{ '--card-color': sensor.color }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card-background"></div>
      <div className="card-content">
        <div className="card-header">
          <motion.div
            className="icon-wrapper"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Icon className="sensor-icon" />
          </motion.div>
          <span className="card-status">{sensor.status}</span>
        </div>
        
        <div className="card-body">
          <motion.div
            key={sensor.value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="value-container"
          >
            <span className="sensor-value">{sensor.value}</span>
            <span className="sensor-unit">{sensor.unit}</span>
          </motion.div>
          
          <motion.div
            className="trend-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isIncreasing ? '↑' : '↓'}
          </motion.div>
        </div>
        
        <div className="card-footer">
          <span className="card-title">{sensor.title}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default SensorCard
