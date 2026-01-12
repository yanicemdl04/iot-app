import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { FaRunning } from 'react-icons/fa'
import { motion } from 'framer-motion'
import './Chart.css'

const ActivityChart = ({ data }) => {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    const newDataPoint = {
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      steps: Math.floor(data.steps % 100),
      calories: Math.floor(data.calories % 50)
    }
    
    setChartData(prev => {
      const updated = [...prev, newDataPoint]
      return updated.slice(-10) // Garder seulement les 10 derniers points
    })
  }, [data])

  const colors = ['#95E1D3', '#FFA07A', '#4ECDC4', '#FF6B6B', '#95E1D3']

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
          <FaRunning className="chart-icon" style={{ color: '#95E1D3' }} />
          <h3>Activité Physique</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
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
            <Bar dataKey="steps" fill="#95E1D3" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
            <Bar dataKey="calories" fill="#FFA07A" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[(index + 2) % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default ActivityChart
