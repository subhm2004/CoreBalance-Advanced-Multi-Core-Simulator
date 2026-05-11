'use client'

import { ScheduleResult } from '@/types'
import GanttChart from './GanttChart'
import MetricsTable from './MetricsTable'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useTheme } from 'next-themes'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ComparisonViewProps {
  results: Record<string, ScheduleResult>
  timeQuantum: number
}

export default function ComparisonView({ results, timeQuantum }: ComparisonViewProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = (resolvedTheme || theme) === 'dark'
  
  const algorithms = Object.keys(results)

  if (algorithms.length === 0) {
    return (
      <div className="card">
        <p className="text-[var(--cb-text-muted)]">No valid results to compare.</p>
      </div>
    )
  }

  // Prepare comparison chart data
  const comparisonData = {
    labels: algorithms,
    datasets: [
      {
        label: 'Average Waiting Time',
        data: algorithms.map(alg => results[alg].avgWaitingTime),
        backgroundColor: isDark ? 'rgba(129, 140, 248, 0.75)' : 'rgba(79, 70, 229, 0.75)',
        borderColor: isDark ? 'rgba(165, 180, 252, 1)' : 'rgba(67, 56, 202, 1)',
        borderWidth: 1,
      },
      {
        label: 'Average Turnaround Time',
        data: algorithms.map(alg => results[alg].avgTurnaroundTime),
        backgroundColor: isDark ? 'rgba(45, 212, 191, 0.65)' : 'rgba(13, 148, 136, 0.65)',
        borderColor: isDark ? 'rgba(94, 234, 212, 1)' : 'rgba(15, 118, 110, 1)',
        borderWidth: 1,
      },
    ],
  }

  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e2e8f0' : '#1e293b',
        },
      },
      title: {
        display: true,
        text: 'Algorithm Performance Comparison',
        color: isDark ? '#e2e8f0' : '#1e293b',
      },
    },
    scales: {
      y: {
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
      x: {
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
      <div className="card space-y-4">
        <h2 className="card-title">Performance Comparison</h2>
        <div className="h-64 rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] p-3">
          <Bar key={isDark ? 'dark' : 'light'} data={comparisonData} options={comparisonOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {algorithms.map((algorithm) => (
          <div key={algorithm} className="card space-y-4">
            <h3 className="text-xl font-semibold text-[var(--cb-text)]">{algorithm}</h3>
            <div className="space-y-4">
              <GanttChart ganttChart={results[algorithm].ganttChart} />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-2">
                  <div className="text-[var(--cb-text-muted)]">Avg Wait</div>
                  <div className="font-bold text-[var(--cb-text)]">
                    {results[algorithm].avgWaitingTime.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-2">
                  <div className="text-[var(--cb-text-muted)]">Avg Turnaround</div>
                  <div className="font-bold text-[var(--cb-text)]">
                    {results[algorithm].avgTurnaroundTime.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] p-2">
                  <div className="text-[var(--cb-text-muted)]">Total Time</div>
                  <div className="font-bold text-[var(--cb-text)]">{results[algorithm].totalTime}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
