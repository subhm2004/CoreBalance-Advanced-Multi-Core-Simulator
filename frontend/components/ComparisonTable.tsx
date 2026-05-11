'use client'

import { DualCoreScheduleResult } from '@/types'

interface ComparisonTableProps {
  results: Record<string, DualCoreScheduleResult>
}

interface AlgorithmMetrics {
  name: string
  avgWaitingTime: number
  avgTurnaroundTime: number
  avgCpuUtilization: number
  efficiency: number // Combined score for ranking
}

export default function ComparisonTable({ results }: ComparisonTableProps) {
  // Calculate metrics for each algorithm
  const algorithms: AlgorithmMetrics[] = Object.entries(results)
    .map(([name, result]) => {
      // Average waiting and turnaround across both cores
      const avgWaiting = (result.core0_results.avgWaitingTime + result.core1_results.avgWaitingTime) / 2
      const avgTurnaround = (result.core0_results.avgTurnaroundTime + result.core1_results.avgTurnaroundTime) / 2
      
      // Efficiency score: lower waiting + turnaround times and higher CPU utilization = better
      // Normalize: lower is better for waiting/turnaround, higher is better for utilization
      const efficiency = 100 - (avgWaiting + avgTurnaround) / 2 + result.avgCpuUtilization
      
      return {
        name: name.replace('DualCore', ''),
        avgWaitingTime: avgWaiting,
        avgTurnaroundTime: avgTurnaround,
        avgCpuUtilization: result.avgCpuUtilization,
        efficiency,
      }
    })
    .sort((a, b) => b.efficiency - a.efficiency) // Sort by efficiency (higher is better)

  const getRankBadge = (index: number) => {
    const rank = index + 1
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  return (
    <div className="card space-y-4">
      <h2 className="card-title">Algorithm Comparison</h2>
      <div className="overflow-x-auto rounded-[var(--cb-radius)] border border-[var(--cb-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--cb-border)] bg-[var(--cb-accent-soft)]">
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">Rank</th>
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">Algorithm</th>
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">Avg Waiting Time</th>
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">Avg Turnaround Time</th>
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">CPU Utilization</th>
              <th className="p-3 text-left font-semibold text-[var(--cb-text)]">Efficiency Score</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map((alg, index) => (
              <tr
                key={alg.name}
                className="border-b border-[var(--cb-border)] transition-colors hover:bg-[var(--cb-accent-soft)]"
              >
                <td className="p-3 font-bold text-[var(--cb-text)]">{getRankBadge(index)}</td>
                <td className="p-3 font-semibold text-[var(--cb-text)]">{alg.name}</td>
                <td className="p-3 text-[var(--cb-text-muted)]">{alg.avgWaitingTime.toFixed(2)}</td>
                <td className="p-3 text-[var(--cb-text-muted)]">{alg.avgTurnaroundTime.toFixed(2)}</td>
                <td className="p-3 text-[var(--cb-text-muted)]">{alg.avgCpuUtilization.toFixed(2)}%</td>
                <td className="p-3 font-medium text-[var(--cb-accent)]">{alg.efficiency.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
