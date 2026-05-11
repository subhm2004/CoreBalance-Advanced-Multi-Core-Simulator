'use client'

import { GanttEntry } from '@/types'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface GanttChartProps {
  ganttChart: GanttEntry[]
  currentTimeUnit?: number
  isSimulating?: boolean
}

export default function GanttChart({ ganttChart, currentTimeUnit = 0, isSimulating = false }: GanttChartProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'

  if (!ganttChart || ganttChart.length === 0) {
    return (
      <div className="py-8 text-center text-[var(--cb-text-muted)]">No data to display</div>
    )
  }

  const timelineCap = isSimulating ? currentTimeUnit : Number.POSITIVE_INFINITY
  const visibleEntries = ganttChart
    .filter((entry) => entry.startTime < timelineCap)
    .map((entry) => ({
      ...entry,
      endTime: Math.min(entry.endTime, timelineCap),
    }))
    .filter((entry) => entry.endTime > entry.startTime)

  // Get unique process IDs and create color mapping
  const processIds = Array.from(new Set(ganttChart.map((entry) => entry.processId))).sort((a, b) => a - b)
  
  // Color schemes based on theme
  const darkColors = [
    'rgba(34, 197, 94, 0.8)',   // Neon Green
    'rgba(59, 130, 246, 0.8)',   // Neon Blue
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(16, 185, 129, 0.8)',   // Teal
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(239, 68, 68, 0.8)',   // Red
  ]

  const lightColors = [
    'rgba(147, 197, 253, 0.8)',  // Pastel Blue
    'rgba(196, 181, 253, 0.8)',  // Pastel Purple
    'rgba(252, 211, 77, 0.8)',   // Pastel Yellow
    'rgba(252, 165, 165, 0.8)',  // Pastel Red
    'rgba(167, 243, 208, 0.8)',   // Pastel Green
    'rgba(254, 202, 202, 0.8)',  // Pastel Pink
    'rgba(253, 224, 71, 0.8)',   // Pastel Yellow
    'rgba(196, 181, 253, 0.8)',  // Pastel Lavender
  ]

  const colors = isDark ? darkColors : lightColors

  // Prepare data for Chart.js
  const durations = visibleEntries.map((entry) => entry.endTime - entry.startTime)

  const chartData = {
    labels: visibleEntries.map((entry) => `P${entry.processId} (${entry.startTime}-${entry.endTime})`),
    datasets: [
      {
        label: 'Execution Time',
        data: durations,
        backgroundColor: visibleEntries.map((entry) => {
          const idx = processIds.indexOf(entry.processId)
          return colors[idx % colors.length]
        }),
        borderColor: visibleEntries.map((entry) => {
          const idx = processIds.indexOf(entry.processId)
          return colors[idx % colors.length].replace('0.8', '1')
        }),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    indexAxis: 'y' as const,
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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex
            const entry = visibleEntries[index]
            return `Process ${entry.processId}: ${entry.startTime} - ${entry.endTime} (Duration: ${entry.endTime - entry.startTime})`
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
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
      y: {
        title: {
          display: true,
          text: 'Process Execution',
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--cb-text-muted)]">
          Timeline Progress:{' '}
          <span className="font-bold text-[var(--cb-text)]">
            {isFinite(timelineCap) ? currentTimeUnit : ganttChart[ganttChart.length - 1].endTime}
          </span>
        </p>
        {isSimulating && (
          <span className="rounded-full border border-[var(--cb-accent)] bg-[var(--cb-accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--cb-accent)]">
            Live Simulation
          </span>
        )}
      </div>
      <div className="h-72 rounded-[var(--cb-radius-lg)] border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] p-3">
        <Bar key={isDark ? 'dark' : 'light'} data={chartData} options={options} />
      </div>
      <div className="mt-4 rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-4">
        <h3 className="mb-2 font-semibold text-[var(--cb-text)]">Timeline Details</h3>
        <div className="space-y-1 text-sm">
          {visibleEntries.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-mono text-[var(--cb-text-muted)]">
                [{entry.startTime} - {entry.endTime}]
              </span>
              <span className="px-2 py-1 rounded text-white text-xs" 
                    style={{ backgroundColor: colors[processIds.indexOf(entry.processId) % colors.length] }}>
                P{entry.processId}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
