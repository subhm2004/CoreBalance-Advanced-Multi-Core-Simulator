'use client'

interface SimulationControlsProps {
  isRunning: boolean
  onPlayPause: () => void
  onReplay: () => void
  onStepForward: () => void
  speed: number
  onSpeedChange: (speed: number) => void
  currentTimeUnit: number
  totalTimeUnits: number
  isStepMode: boolean
  onToggleStepMode: () => void
  /** Tighter layout for dashboard grid */
  compact?: boolean
  className?: string
}

export default function SimulationControls({
  isRunning,
  onPlayPause,
  onReplay,
  onStepForward,
  speed,
  onSpeedChange,
  currentTimeUnit,
  totalTimeUnits,
  isStepMode,
  onToggleStepMode,
  compact = false,
  className = '',
}: SimulationControlsProps) {
  const progress = totalTimeUnits > 0 ? (currentTimeUnit / totalTimeUnits) * 100 : 0

  return (
    <div
      className={`card flex flex-col ${compact ? '!p-2.5 md:!p-3 space-y-2' : 'space-y-4'} ${className}`.trim()}
    >
      <h2 className={compact ? 'mb-1.5 text-sm font-semibold tracking-tight text-[var(--cb-text)]' : 'card-title'}>
        Simulation Timeline Controls
      </h2>

      {/* Progress Bar */}
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        <div className={`flex justify-between text-[var(--cb-text-muted)] ${compact ? 'text-xs' : 'text-sm'}`}>
          <span>Time: {currentTimeUnit}</span>
          <span>Total: {totalTimeUnits}</span>
        </div>
        <div className="w-full rounded-full h-2 overflow-hidden bg-[var(--cb-border)]">
          <div
            className="h-full transition-all duration-300 rounded-full bg-[var(--cb-accent)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={onPlayPause}
          className="btn-primary text-sm h-10 flex items-center justify-center"
          title={isRunning ? 'Pause simulation' : 'Play simulation'}
        >
          {isRunning ? '⏸️ Pause' : '▶️ Play'}
        </button>
        
        <button
          onClick={onReplay}
          className="btn-secondary text-sm h-10 flex items-center justify-center"
          title="Replay from beginning"
        >
          🔄 Replay
        </button>
        
        <button
          onClick={onStepForward}
          disabled={!isStepMode || currentTimeUnit >= totalTimeUnits}
          className="btn-secondary text-sm h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          title="Execute next time unit (Step mode only)"
        >
          ⏭️ Step
        </button>

        <button
          onClick={onToggleStepMode}
          className={`text-sm h-10 flex items-center justify-center rounded-[var(--cb-radius)] font-semibold transition-colors ${
            isStepMode
              ? 'bg-[var(--cb-accent)] text-white'
              : 'bg-[var(--cb-bg)] text-[var(--cb-text)] border border-[var(--cb-border)]'
          }`}
          title="Toggle step-through debugging mode"
        >
          {isStepMode ? '🐢 Step' : '▶️ Auto'}
        </button>
      </div>

      {/* Speed Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[var(--cb-text)]">
            Speed: {speed.toFixed(1)}x
          </label>
          <span className="text-xs text-[var(--cb-text-muted)]">
            {isStepMode ? 'Manual (Step Mode)' : `${Math.round(800 / speed)}ms per tick`}
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="range"
            min="0.5"
            max="4"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            disabled={isStepMode}
            className="flex-1 h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--cb-border)] accent-[var(--cb-accent)]"
          />
          <div className="flex gap-1">
            <button
              onClick={() => onSpeedChange(Math.max(0.5, speed - 0.5))}
              disabled={isStepMode || speed <= 0.5}
              className="w-8 h-8 rounded border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] hover:bg-[var(--cb-accent-soft)] disabled:opacity-50"
            >
              −
            </button>
            <button
              onClick={() => onSpeedChange(Math.min(4, speed + 0.5))}
              disabled={isStepMode || speed >= 4}
              className="w-8 h-8 rounded border border-[var(--cb-border)] bg-[var(--cb-bg-elevated)] hover:bg-[var(--cb-accent-soft)] disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div
        className={`rounded-[var(--cb-radius)] border border-[var(--cb-border)] bg-[var(--cb-accent-soft)] text-[var(--cb-text-muted)] ${
          compact ? 'p-2 text-xs leading-snug' : 'p-3 text-sm'
        }`}
      >
        {isStepMode ? (
          <p className={compact ? 'line-clamp-3' : ''}>
            <span className="font-semibold">Step Mode Active</span>: Click &quot;Step&quot; for one tick at a time.
          </p>
        ) : (
          <p className={compact ? 'line-clamp-3' : ''}>
            <span className="font-semibold">Auto Mode</span>: Plays at selected speed. Switch to Step for manual ticks.
          </p>
        )}
      </div>
    </div>
  )
}
