'use client'

import { ScheduleResult } from '@/types'

interface MetricsTableProps {
  result: ScheduleResult
}

export default function MetricsTable({ result }: MetricsTableProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-[var(--cb-radius)] border border-[var(--cb-border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--cb-border)] bg-[var(--cb-accent-soft)]">
              <th className="text-left p-3 font-bold text-[var(--cb-text)]">Process</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Arrival</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Burst</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Start</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Completion</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Waiting</th>
              <th className="text-center p-3 font-bold text-[var(--cb-text)]">Turnaround</th>
            </tr>
          </thead>
          <tbody>
            {result.processes.map((process) => (
              <tr
                key={process.id}
                className="border-b border-[var(--cb-border)] transition-colors hover:bg-[var(--cb-accent-soft)]"
              >
                <td className="p-3">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cb-accent)] text-sm font-bold text-white">
                    P{process.id}
                  </div>
                </td>
                <td className="p-3 text-center font-semibold text-[var(--cb-text)]">{process.arrivalTime}</td>
                <td className="p-3 text-center font-semibold text-[var(--cb-text)]">{process.burstTime}</td>
                <td className="p-3 text-center font-semibold text-[var(--cb-accent)]">{process.startTime}</td>
                <td className="p-3 text-center font-semibold text-[var(--cb-accent)]">{process.completionTime}</td>
                <td className="p-3 text-center">
                  <span className="chip border border-[var(--cb-border)] font-bold">{process.waitingTime}</span>
                </td>
                <td className="p-3 text-center">
                  <span className="chip border border-[var(--cb-border)] font-bold">{process.turnaroundTime}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)]">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">⏳</span>
            <div className="mb-1 text-sm font-bold text-[var(--cb-text-muted)]">Average Waiting Time</div>
            <div className="text-3xl font-black text-[var(--cb-accent)]">{result.avgWaitingTime.toFixed(2)}</div>
          </div>
        </div>
        <div className="card border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)]">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">🔄</span>
            <div className="mb-1 text-sm font-bold text-[var(--cb-text-muted)]">Average Turnaround Time</div>
            <div className="text-3xl font-black text-[var(--cb-accent)]">{result.avgTurnaroundTime.toFixed(2)}</div>
          </div>
        </div>
        <div className="card border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)]">
          <div className="flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">⏱️</span>
            <div className="mb-1 text-sm font-bold text-[var(--cb-text-muted)]">Total Time</div>
            <div className="text-3xl font-black text-[var(--cb-accent)]">{result.totalTime}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
