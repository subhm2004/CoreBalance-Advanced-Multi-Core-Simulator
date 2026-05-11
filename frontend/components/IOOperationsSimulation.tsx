'use client'

interface IOOperation {
  id: number
  processId: number
  type: 'READ' | 'WRITE' | 'DISK' | 'NETWORK'
  startTime: number
  duration: number
  endTime: number
  status: 'pending' | 'active' | 'completed'
}

interface IOOperationsSimulationProps {
  operations: IOOperation[]
  currentTime: number
}

export default function IOOperationsSimulation({
  operations,
  currentTime,
}: IOOperationsSimulationProps) {
  const getIOColor = (type: string) => {
    switch (type) {
      case 'READ':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
      case 'WRITE':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'
      case 'DISK':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
      case 'NETWORK':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
      default:
        return 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
    }
  }

  const getIOIcon = (type: string) => {
    switch (type) {
      case 'READ':
        return '📖'
      case 'WRITE':
        return '✍️'
      case 'DISK':
        return '💾'
      case 'NETWORK':
        return '🌐'
      default:
        return '⚙️'
    }
  }

  const getStatus = (op: IOOperation) => {
    if (currentTime < op.startTime) return 'pending'
    if (currentTime >= op.startTime && currentTime < op.endTime) return 'active'
    return 'completed'
  }

  const activeOperations = operations.filter(op => getStatus(op) === 'active')
  const completedOperations = operations.filter(op => getStatus(op) === 'completed')
  const pendingOperations = operations.filter(op => getStatus(op) === 'pending')

  return (
    <div className="card space-y-4">
      <h2 className="card-title">💾 I/O Operations Simulation</h2>

      {/* Timeline Visualization */}
      <div className="space-y-3">
        {operations.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No I/O operations</p>
        ) : (
          <>
            {/* Timeline Header */}
            <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
              Current Time: <span className="font-bold">{currentTime}ms</span>
            </div>

            {/* Operations Timeline */}
            {operations.map((op) => {
              const status = getStatus(op)
              const progress = op.duration > 0 ? ((currentTime - op.startTime) / op.duration) * 100 : 0
              const clampedProgress = Math.max(0, Math.min(100, progress))
              const timelineStart = (op.startTime / (Math.max(...operations.map(o => o.endTime), 100))) * 100
              const timelineWidth = (op.duration / (Math.max(...operations.map(o => o.endTime), 100))) * 100

              return (
                <div key={op.id} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-fit">
                      <span className="text-lg">{getIOIcon(op.type)}</span>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                        P{op.processId}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded border ${getIOColor(op.type)}`}>
                        {op.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                      {op.startTime}ms → {op.endTime}ms
                    </div>
                  </div>

                  {/* Timeline Bar */}
                  <div className="relative h-6 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                    {/* Background for completed operations */}
                    {status === 'completed' && (
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-300"
                        style={{
                          left: `${timelineStart}%`,
                          width: `${timelineWidth}%`,
                          opacity: 0.3,
                        }}
                      ></div>
                    )}

                    {/* Current progress bar */}
                    {(status === 'pending' || status === 'active') && (
                      <div
                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                          status === 'active'
                            ? 'bg-gradient-to-r from-red-500 to-red-400'
                            : 'bg-gradient-to-r from-slate-400 to-slate-300'
                        }`}
                        style={{
                          left: `${timelineStart}%`,
                          width: status === 'active' ? `${Math.min(clampedProgress, 100)}%` : `1%`,
                        }}
                      ></div>
                    )}

                    {/* Status Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                      {status === 'active' ? (
                        <span className="text-white drop-shadow animate-pulse">
                          {Math.round(clampedProgress)}%
                        </span>
                      ) : status === 'completed' ? (
                        <span className="text-green-700 dark:text-green-300">✓</span>
                      ) : (
                        <span className="text-slate-500">⏳</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded border border-amber-200 dark:border-amber-800">
          <div className="text-amber-700 dark:text-amber-300 text-xs">Pending</div>
          <div className="font-bold text-lg text-amber-600 dark:text-amber-400">{pendingOperations.length}</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
          <div className="text-red-700 dark:text-red-300 text-xs">Active</div>
          <div className="font-bold text-lg text-red-600 dark:text-red-400">{activeOperations.length}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
          <div className="text-green-700 dark:text-green-300 text-xs">Completed</div>
          <div className="font-bold text-lg text-green-600 dark:text-green-400">{completedOperations.length}</div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 text-xs text-slate-700 dark:text-slate-300">
        <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">ℹ️ I/O Operations</p>
        <p>Simulates disk reads/writes and network operations. These block processes until completion, affecting overall scheduling performance.</p>
      </div>
    </div>
  )
}
