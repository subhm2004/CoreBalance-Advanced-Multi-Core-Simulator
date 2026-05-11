'use client'

interface AlgorithmSelectorProps {
  selectedAlgorithm: string
  setSelectedAlgorithm: (algorithm: string) => void
  timeQuantum: number
  setTimeQuantum: (quantum: number) => void
  viewMode: 'single' | 'compare' | 'dualcore'
  setViewMode: (mode: 'single' | 'compare' | 'dualcore') => void
  /** Denser layout for dashboard grid */
  compact?: boolean
}

export default function AlgorithmSelector({
  selectedAlgorithm,
  setSelectedAlgorithm,
  timeQuantum,
  setTimeQuantum,
  viewMode,
  setViewMode,
  compact = false,
}: AlgorithmSelectorProps) {
  const algorithms = [
    { value: 'FCFS', label: 'First Come First Served (FCFS)' },
    { value: 'SJF', label: 'Shortest Job First (SJF)' },
    { value: 'RoundRobin', label: 'Round Robin' },
    { value: 'Priority', label: 'Priority Scheduling' },
  ]

  const modePad = compact ? 'p-2.5 rounded-lg border-2' : 'p-4 rounded-xl border-2'
  const modeLabelCls = compact
    ? 'mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[var(--cb-text-muted)]'
    : 'mb-3 block text-sm font-bold uppercase tracking-wide text-[var(--cb-text)]'
  const fieldLabelCls = compact
    ? 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-[var(--cb-text)]'
    : 'mb-3 block text-sm font-bold uppercase tracking-wide text-[var(--cb-text)]'

  return (
    <div className={compact ? 'space-y-3' : 'space-y-6'}>
      <div>
        <label className={modeLabelCls}>View Mode</label>
        <div className={`grid grid-cols-1 gap-2 sm:grid-cols-3 ${compact ? 'sm:gap-2' : 'gap-3'}`}>
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="single"
              checked={viewMode === 'single'}
              onChange={(e) => setViewMode(e.target.value as 'single' | 'compare' | 'dualcore')}
              className="sr-only"
            />
            <div
              className={`${modePad} transition-all ${viewMode === 'single' ? 'border-[var(--cb-accent)] bg-[var(--cb-accent-soft)] shadow-sm' : 'border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] hover:border-indigo-400 dark:hover:border-indigo-400'}`}
            >
              <span className={`font-semibold text-[var(--cb-text)] ${compact ? 'text-xs' : 'text-sm'}`}>Single</span>
              {!compact && (
                <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Classic one-core simulation</p>
              )}
            </div>
          </label>
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="dualcore"
              checked={viewMode === 'dualcore'}
              onChange={(e) => setViewMode(e.target.value as 'single' | 'compare' | 'dualcore')}
              className="sr-only"
            />
            <div
              className={`${modePad} transition-all ${viewMode === 'dualcore' ? 'border-[var(--cb-accent)] bg-[var(--cb-accent-soft)] shadow-sm' : 'border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] hover:border-indigo-400 dark:hover:border-indigo-400'}`}
            >
              <span className={`font-semibold text-[var(--cb-text)] ${compact ? 'text-xs' : 'text-sm'}`}>Dual</span>
              {!compact && (
                <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Load balancing across cores</p>
              )}
            </div>
          </label>
          <label className="relative cursor-pointer">
            <input
              type="radio"
              value="compare"
              checked={viewMode === 'compare'}
              onChange={(e) => setViewMode(e.target.value as 'single' | 'compare' | 'dualcore')}
              className="sr-only"
            />
            <div
              className={`${modePad} transition-all ${viewMode === 'compare' ? 'border-[var(--cb-accent)] bg-[var(--cb-accent-soft)] shadow-sm' : 'border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] hover:border-indigo-400 dark:hover:border-indigo-400'}`}
            >
              <span className={`font-semibold text-[var(--cb-text)] ${compact ? 'text-xs' : 'text-sm'}`}>Compare</span>
              {!compact && (
                <p className="mt-1 text-xs text-[var(--cb-text-muted)]">Benchmark all algorithms</p>
              )}
            </div>
          </label>
        </div>
      </div>

      {(viewMode === 'single' || viewMode === 'dualcore') && (
        <div>
          <label className={fieldLabelCls}>Scheduling Algorithm</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="input-field font-medium"
          >
            {algorithms.map((alg) => (
              <option key={alg.value} value={alg.value}>
                {alg.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={fieldLabelCls}>Time Quantum (Round Robin)</label>
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-10 shrink-0 items-center rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-bg)] px-3 text-xs font-semibold tabular-nums text-[var(--cb-text-muted)]"
            title="Time quantum"
          >
            TQ
          </span>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 2)}
            min="1"
            className="input-field !w-auto min-h-10 min-w-0 flex-1 basis-0 !py-0 pl-3 pr-3 font-semibold tabular-nums leading-none"
          />
        </div>
      </div>
    </div>
  )
}
