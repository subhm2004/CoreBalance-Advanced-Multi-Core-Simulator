'use client'

import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface CPUUtilizationChartProps {
  utilization: number[]
  title?: string
}

export default function CPUUtilizationChart({ utilization, title = 'System Stress - CPU Utilization' }: CPUUtilizationChartProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'

  const labels = utilization.map((_, index) => index.toString())
  
  const chartData = {
    labels,
    datasets: [{
      label: 'CPU Utilization (%)',
      data: utilization,
      borderColor: isDark ? 'rgba(129, 140, 248, 1)' : 'rgba(79, 70, 229, 1)',
      backgroundColor: isDark ? 'rgba(129, 140, 248, 0.12)' : 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 4,
    }],
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
        max: 100,
        title: {
          display: true,
          text: 'Utilization (%)',
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

  return (
    <div className="card">
      <div className="h-64 rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] p-3">
        <Line key={isDark ? 'dark' : 'light'} data={chartData} options={options} />
      </div>
    </div>
  )
}
