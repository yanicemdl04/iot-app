import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { FaHeartbeat } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './Chart.css'

const HeartRateChart = ({ data }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const newDataPoint = {
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      heartRate: data.heartRate,
      temperature: parseFloat(data.temperature)
    }
    
    setChartData(prev => {
      const updated = [...prev, newDataPoint]
      return updated.slice(-20) // Garder seulement les 20 derniers points
    })
  }, [data])

  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-background"></div>
      <div className="chart-content">
        <div className="chart-header">
          <FaHeartbeat className="chart-icon" style={{ color: '#FF6B6B' }} />
          <h3>Fréquence Cardiaque & Température</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6B6B" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#FF6B6B" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ECDC4" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#4ECDC4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="heartRate" 
              stroke="#FF6B6B" 
              fillOpacity={1} 
              fill="url(#colorHeartRate)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="temperature" 
              stroke="#4ECDC4" 
              fillOpacity={1} 
              fill="url(#colorTemperature)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default HeartRateChart
