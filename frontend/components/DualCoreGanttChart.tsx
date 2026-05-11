'use client'

import { GanttEntry } from '@/types'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface DualCoreGanttChartProps {
  core0Gantt: GanttEntry[]
  core1Gantt: GanttEntry[]
  core0Processes?: any[]
  core1Processes?: any[]
  title?: string
  currentTimeUnit?: number
  isSimulating?: boolean
}

export default function DualCoreGanttChart({
  core0Gantt,
  core1Gantt,
  core0Processes = [],
  core1Processes = [],
  title = 'Dual-Core Gantt Chart',
  currentTimeUnit = 0,
  isSimulating = false,
}: DualCoreGanttChartProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'
  const timelineCap = isSimulating ? currentTimeUnit : Number.POSITIVE_INFINITY

  const visibleCore0 = core0Gantt
    .filter((entry) => entry.startTime < timelineCap)
    .map((entry) => ({ ...entry, endTime: Math.min(entry.endTime, timelineCap) }))
    .filter((entry) => entry.endTime > entry.startTime)
  const visibleCore1 = core1Gantt
    .filter((entry) => entry.startTime < timelineCap)
    .map((entry) => ({ ...entry, endTime: Math.min(entry.endTime, timelineCap) }))
    .filter((entry) => entry.endTime > entry.startTime)

  // Get unique process IDs
  const allProcessIds = Array.from(
    new Set([...core0Gantt.map((e) => e.processId), ...core1Gantt.map((e) => e.processId)])
  ).sort((a, b) => a - b)
  
  // Color schemes
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

  // Create a map of process IDs to aging status
  const agedProcesses = new Set<number>()
  core0Processes.forEach(p => { if (p.isAged) agedProcesses.add(p.id) })
  core1Processes.forEach(p => { if (p.isAged) agedProcesses.add(p.id) })
  
  // Prepare Core 0 data
  const core0Labels = visibleCore0.map((entry) => `P${entry.processId} (${entry.startTime}-${entry.endTime})`)
  const core0Data = visibleCore0.map(entry => entry.endTime - entry.startTime)
  const core0Colors = visibleCore0.map(entry => {
    // Gold color for aged processes
    if (agedProcesses.has(entry.processId)) {
      return isDark ? 'rgba(234, 179, 8, 0.9)' : 'rgba(234, 179, 8, 0.8)'
    }
    const idx = allProcessIds.indexOf(entry.processId)
    return colors[idx % colors.length]
  })

  // Prepare Core 1 data
  const core1Labels = visibleCore1.map((entry) => `P${entry.processId} (${entry.startTime}-${entry.endTime})`)
  const core1Data = visibleCore1.map(entry => entry.endTime - entry.startTime)
  const core1Colors = visibleCore1.map(entry => {
    // Gold color for aged processes
    if (agedProcesses.has(entry.processId)) {
      return isDark ? 'rgba(234, 179, 8, 0.9)' : 'rgba(234, 179, 8, 0.8)'
    }
    const idx = allProcessIds.indexOf(entry.processId)
    return colors[idx % colors.length]
  })

  const core0ChartData = {
    labels: core0Labels,
    datasets: [{
      label: 'Core 0 Execution Time',
      data: core0Data,
      backgroundColor: core0Colors,
      borderColor: core0Colors.map(c => c.replace('0.8', '1')),
      borderWidth: 1,
    }],
  }

  const core1ChartData = {
    labels: core1Labels,
    datasets: [{
      label: 'Core 1 Execution Time',
      data: core1Data,
      backgroundColor: core1Colors,
      borderColor: core1Colors.map(c => c.replace('0.8', '1')),
      borderWidth: 1,
    }],
  }

  const chartOptions = {
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
            const entry = context.datasetIndex === 0 ? visibleCore0[index] : visibleCore1[index]
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-[var(--cb-text)]">{title}</h3>
        {isSimulating && (
          <span className="rounded-full border border-[var(--cb-accent)] bg-[var(--cb-accent-soft)] px-2 py-1 text-xs font-semibold text-[var(--cb-accent)]">
            Time {currentTimeUnit}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-4">
          <h4 className="mb-3 text-lg font-medium text-[var(--cb-text)]">Core 0</h4>
          <div className="h-64">
            <Bar key={`core0-${isDark ? 'dark' : 'light'}`} data={core0ChartData} options={chartOptions} />
          </div>
        </div>
        <div className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-4">
          <h4 className="mb-3 text-lg font-medium text-[var(--cb-text)]">Core 1</h4>
          <div className="h-64">
            <Bar key={`core1-${isDark ? 'dark' : 'light'}`} data={core1ChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}
