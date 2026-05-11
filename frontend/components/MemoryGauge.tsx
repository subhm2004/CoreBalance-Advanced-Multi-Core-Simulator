'use client'

import { MemorySnapshot } from '@/types'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface MemoryGaugeProps {
  memoryUsage: MemorySnapshot[]
  title?: string
}

export default function MemoryGauge({ memoryUsage, title = 'Live Memory Usage' }: MemoryGaugeProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'

  if (!memoryUsage || memoryUsage.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center">No memory data available</p>
      </div>
    )
  }

  const labels = memoryUsage.map(snapshot => snapshot.time.toString())
  const usedMemory = memoryUsage.map(snapshot => snapshot.usedMemory)
  const availableMemory = memoryUsage.map(snapshot => snapshot.availableMemory)
  
  // Current memory stats
  const currentSnapshot = memoryUsage[memoryUsage.length - 1]
  const memoryPercentage = (currentSnapshot.usedMemory / 1024) * 100

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Used Memory (MB)',
        data: usedMemory,
        borderColor: isDark ? 'rgba(239, 68, 68, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
      {
        label: 'Available Memory (MB)',
        data: availableMemory,
        borderColor: isDark ? 'rgba(34, 197, 94, 1)' : 'rgba(34, 197, 94, 1)',
        backgroundColor: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
      },
      title: {
        display: true,
        text: title,
        color: isDark ? '#e2e8f0' : '#1e293b',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1024,
        title: {
          display: true,
          text: 'Memory (MB)',
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
        ticks: {
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
        grid: {
          color: isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(30, 41, 59, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
        ticks: {
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
        grid: {
          color: isDark ? 'rgba(226, 232, 240, 0.1)' : 'rgba(30, 41, 59, 0.1)',
        },
      },
    },
  }

  const getMemoryColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Current Memory Usage</span>
          <span className={`text-2xl font-bold ${getMemoryColor(memoryPercentage)}`}>
            {memoryPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-2">
          <div
            className={`h-4 rounded-full transition-all ${
              memoryPercentage >= 90
                ? 'bg-red-500'
                : memoryPercentage >= 70
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${memoryPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{currentSnapshot.usedMemory} MB / 1024 MB</span>
          <span>{currentSnapshot.availableMemory} MB available</span>
        </div>
      </div>
      <div className="h-64">
        <Line key={isDark ? 'dark' : 'light'} data={chartData} options={options} />
      </div>
    </div>
  )
}
