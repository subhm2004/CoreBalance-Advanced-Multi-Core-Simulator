'use client'

import { DualCoreScheduleResult, Process, ScheduleResult } from '@/types'

interface AlgorithmExplainProps {
  viewMode: 'single' | 'dualcore' | 'compare'
  selectedAlgorithm: string
  processes: Process[]
  timeQuantum: number
  result: ScheduleResult | null
  dualCoreResult: DualCoreScheduleResult | null
  comparisonResults: Record<string, DualCoreScheduleResult> | null
}

function explainSingle(result: ScheduleResult, selectedAlgorithm: string, timeQuantum: number) {
  const notes: string[] = []
  const maxBurst = Math.max(...result.processes.map((p) => p.burstTime))
  const minBurst = Math.min(...result.processes.map((p) => p.burstTime))
  const burstSpread = maxBurst - minBurst

  if (result.avgWaitingTime > result.avgTurnaroundTime * 0.45) {
    notes.push('Average waiting time is high because processes spend a long time queued before getting CPU time.')
  } else {
    notes.push('Waiting time is reasonably balanced, so the scheduler is draining the queue efficiently.')
  }

  if (selectedAlgorithm === 'FCFS' && burstSpread >= 6) {
    notes.push('FCFS likely triggered a convoy effect: long burst jobs arrived early, increasing wait time for shorter jobs.')
  }
  if (selectedAlgorithm === 'SJF' && burstSpread >= 4) {
    notes.push('SJF prioritized shorter jobs, which usually lowers the average waiting time.')
  }
  if (selectedAlgorithm === 'RoundRobin') {
    if (timeQuantum <= 2) {
      notes.push('A small time quantum improves fairness, but it may increase context-switch overhead.')
    } else {
      notes.push('A larger time quantum can make Round Robin behave closer to FCFS with fewer context switches.')
    }
  }
  if (selectedAlgorithm === 'Priority') {
    notes.push('In Priority scheduling, lower-priority processes can wait much longer when high-priority jobs arrive frequently.')
  }

  return notes
}

function explainDual(result: DualCoreScheduleResult) {
  const notes: string[] = []
  const core0 = result.core0_results.totalTime
  const core1 = result.core1_results.totalTime
  const loadGap = Math.abs(core0 - core1)

  if (loadGap > 4) {
    notes.push('There is a noticeable load imbalance: one core finishes significantly earlier than the other.')
  } else {
    notes.push('Dual-core load distribution is balanced; both cores are completing in similar durations.')
  }

  if (result.avgCpuUtilization < 70) {
    notes.push('CPU utilization is relatively low, likely due to idle windows or burst-arrival gaps.')
  } else if (result.avgCpuUtilization > 90) {
    notes.push('High CPU utilization indicates strong core occupancy and minimal idle time.')
  } else {
    notes.push('CPU utilization is in a healthy range, indicating a good balance of throughput and fairness.')
  }

  if (result.contextSwitches > result.totalTime) {
    notes.push('Context-switch count is high, which may indicate increased preemption overhead.')
  }

  return notes
}

function explainCompare(results: Record<string, DualCoreScheduleResult>) {
  const entries = Object.entries(results)
  if (entries.length === 0) return []

  const ranked = entries
    .map(([name, value]) => ({
      name: name.replace('DualCore', ''),
      waiting: (value.core0_results.avgWaitingTime + value.core1_results.avgWaitingTime) / 2,
      turnaround: (value.core0_results.avgTurnaroundTime + value.core1_results.avgTurnaroundTime) / 2,
      cpu: value.avgCpuUtilization,
    }))
    .sort((a, b) => a.waiting + a.turnaround - (b.waiting + b.turnaround))

  const best = ranked[0]
  const worst = ranked[ranked.length - 1]
  const notes = [
    `Best overall latency performer: ${best.name} (low combined waiting + turnaround).`,
    `Highest latency observed in ${worst.name}; it appears least suitable for this workload.`,
  ]

  const bestCpu = [...ranked].sort((a, b) => b.cpu - a.cpu)[0]
  notes.push(`Best CPU utilization was observed in ${bestCpu.name} (${bestCpu.cpu.toFixed(2)}%).`)
  return notes
}

export default function AlgorithmExplain({
  viewMode,
  selectedAlgorithm,
  processes,
  timeQuantum,
  result,
  dualCoreResult,
  comparisonResults,
}: AlgorithmExplainProps) {
  let notes: string[] = []

  if (viewMode === 'single' && result) {
    notes = explainSingle(result, selectedAlgorithm, timeQuantum)
  } else if (viewMode === 'dualcore' && dualCoreResult) {
    notes = explainDual(dualCoreResult)
  } else if (viewMode === 'compare' && comparisonResults) {
    notes = explainCompare(comparisonResults)
  }

  if (!notes.length) return null

  return (
    <div className="card">
      <h2 className="card-title">Algorithm Explain Mode</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
        Run context for {processes.length} processes with quantum {timeQuantum}. Here is why current behavior looks this way:
      </p>
      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 text-sm text-slate-700 dark:text-slate-200">
            {note}
          </div>
        ))}
      </div>
    </div>
  )
}
