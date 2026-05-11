'use client'

interface ProcessAging {
  processId: number
  originalPriority: number
  currentPriority: number
  waitingTime: number
  agingIncrements: number
}

interface PriorityAgingVisualizationProps {
  processes: ProcessAging[]
  timeUnit: number
}

export default function PriorityAgingVisualization({
  processes,
  timeUnit,
}: PriorityAgingVisualizationProps) {
  const maxWaitingTime = Math.max(...processes.map(p => p.waitingTime), 1)
  const maxPriorityImprovement = Math.max(...processes.map(p => p.originalPriority - p.currentPriority), 1)

  return (
    <div className="card space-y-4">
      <h2 className="card-title">🔝 Process Priority Aging</h2>
      
      <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
        Current Time: <span className="font-bold">{timeUnit}ms</span>
      </div>

      {processes.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 text-center py-8">No processes yet</p>
      ) : (
        <div className="space-y-3">
          {processes.map((proc) => {
            const priorityImprovement = proc.originalPriority - proc.currentPriority
            const priorityImprovementPercent = maxPriorityImprovement > 0 
              ? (priorityImprovement / maxPriorityImprovement) * 100 
              : 0
            const waitingPercent = (proc.waitingTime / maxWaitingTime) * 100

            return (
              <div key={proc.processId} className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg border-l-4 border-red-500">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">
                      P{proc.processId}
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Process {proc.processId}
                    </span>
                  </div>
                  <div className="text-sm font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                    Wait: {proc.waitingTime}ms
                  </div>
                </div>

                {/* Priority Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">
                        Original Priority: {proc.originalPriority}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400">
                        Current: {proc.currentPriority} {priorityImprovement > 0 && <span className="text-green-600 dark:text-green-400">(↑ {priorityImprovement})</span>}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                        style={{ width: `${priorityImprovementPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Waiting Time Bar */}
                <div className="space-y-1">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Waiting Time Progression
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${waitingPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Aging Increments */}
                <div className="text-xs">
                  <span className="text-slate-600 dark:text-slate-400">
                    Aging Increments Applied: 
                  </span>
                  <span className="ml-1 font-mono bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">
                    {proc.agingIncrements}x
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 text-xs text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">ℹ️ Priority Aging</p>
        <p>Processes waiting longer automatically get priority boosts to prevent starvation. Green bar shows priority improvement from original value.</p>
      </div>
    </div>
  )
}
